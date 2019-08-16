use super::*;
use crate::document::node::Heading;

impl ODTParser {
    pub fn parse_styles(
        &mut self,
        archive: &mut zip::ZipArchive<std::fs::File>,
    ) -> Result<(), String> {
        // returns a ZipFile struct which implements Read if the file is in the archive
        let styles_xml = archive.by_name("styles.xml");
        if let Err(e) = styles_xml {
            // Handle case where there is no content.xml (so probably not actually an ODT file)
            return Err(e.to_string());
        }
        let content_xml = BufReader::new(styles_xml.unwrap()); //add buffering because quick-xml's reader requires it
        let mut parser = Reader::from_reader(content_xml);
        let mut buffer = Vec::new();

        // These are here instead of the struct because we may need to move the contents of these somewhere else
        let mut current_style_name = String::new();
        let mut current_style_value: Option<Style> = None;
        loop {
            // Iterate through the XML
            match parser.read_event(&mut buffer) {
                Ok(Event::Start(contents)) => {
                    // If there is already an initialised Style object
                    if let Some(style) = current_style_value.as_mut() {
                        if let Some((current_style_name_new, current_style_value_new)) = self
                            .styles_handle_element_start(
                                std::str::from_utf8(contents.name()).unwrap_or(":"),
                                contents.attributes(),
                                Some(style),
                            )
                        {
                            current_style_name = current_style_name_new;
                            current_style_value = Some(current_style_value_new);
                        }
                    // Else if there is none yet
                    } else if let Some((current_style_name_new, current_style_value_new)) = self
                        .styles_handle_element_start(
                            std::str::from_utf8(contents.name()).unwrap_or(":"),
                            contents.attributes(),
                            None,
                        )
                    {
                        current_style_name = current_style_name_new;
                        current_style_value = Some(current_style_value_new);
                    }
                }
                Ok(Event::End(contents)) => {
                    if let Some((current_style_name_new, current_style_value_new)) = self
                        .styles_handle_element_end(
                            std::str::from_utf8(contents.name()).unwrap_or(":"),
                            current_style_name,
                            current_style_value,
                        )
                    {
                        current_style_name = current_style_name_new;
                        current_style_value = current_style_value_new;
                    } else {
                        current_style_name = String::new();
                        current_style_value = None;
                    }
                }
                Ok(Event::Empty(contents)) => {
                    if let Some(style) = current_style_value.as_mut() {
                        self.styles_handle_element_empty(
                            std::str::from_utf8(contents.name()).unwrap_or(":"),
                            contents.attributes(),
                            style,
                        );
                    }
                }
                Ok(Event::Eof) => break,
                Err(e) => {
                    println!("Styles parsing error: {}", e);
                    return Err(e.to_string());
                }
                _ => {}
            }
        }
        Ok(())
    }

    /// Returns the style name and Style object
    fn styles_handle_element_start(
        &mut self,
        name: &str,
        attributes: Attributes,
        style: Option<&mut Style>,
    ) -> Option<(String, Style)> {
        match name {
            "style:default-style" => {
                let (style_name, style) = default_style_begin(attributes);
                return Some((style_name, style));
            }
            "style:style" => {
                let (style_name, style) = style_style_begin(attributes);
                return Some((style_name, style));
            }
            "table:table-row-properties" if style.is_some() => {
                table_row_properties_begin(attributes, &mut style.unwrap().styles)
            }
            "table:table-properties" if style.is_some() => {
                table_properties_begin(attributes, &mut style.unwrap().styles)
            }
            "table:table-cell-properties" if style.is_some() => {
                table_cell_properties_begin(attributes, &mut style.unwrap().styles)
            }
            _ => (),
        }
        None
    }

    /// This function may or may not actually utilise the style_name and style attributes depending on the tag name,
    /// if they are not used then they are returned
    fn styles_handle_element_end(
        &mut self,
        name: &str,
        style_name: String,
        style: Option<Style>,
    ) -> Option<(String, Option<Style>)> {
        match name {
            "style:default-style" | "style:style" => {
                if let Some(style) = style {
                    self.document_root.styles.classes.insert(style_name, style);
                    return None;
                }
            }
            _ => (),
        }
        Some((style_name, style))
    }

    /// Takes the given tag information and inserts them in the proper format to the given Style struct
    fn styles_handle_element_empty(
        &mut self,
        name: &str,
        attributes: Attributes,
        style: &mut Style,
    ) {
        match name {
            "style:text-properties" => text_properties_begin(attributes, &mut style.styles),
            "style:table-column-properties" => {
                table_column_properties_begin(attributes, &mut style.styles)
            }
            "style:table-cell-properties" => {
                table_cell_properties_begin(attributes, &mut style.styles)
            }
            "style:table-properties" => table_properties_begin(attributes, &mut style.styles),
            _ => (),
        }
    }
}

/// Takes the set of attributes of a style:style tag,
/// and returns the name of the style, the displayed name of the style and the parent style name
fn style_begin_helper(attributes: Attributes) -> (String, String, String, Option<u32>) {
    let mut display_name = String::new();
    let mut style_name = String::new();
    let mut family = String::new();
    let mut parent_style_name: Option<String> = None;
    let mut default_outline_level: Option<u32> = None;
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            match name {
                "style:name" => {
                    style_name = std::str::from_utf8(
                        &i.unescaped_value()
                            .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                    )
                    .unwrap_or("")
                    .to_string();
                }
                "style:family" => {
                    family = std::str::from_utf8(
                        &i.unescaped_value()
                            .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                    )
                    .unwrap_or("")
                    .to_string();
                }
                "style:parent-style-name" => {
                    parent_style_name = Some(
                        std::str::from_utf8(
                            &i.unescaped_value()
                                .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                        )
                        .unwrap_or("")
                        .to_string(),
                    );
                }
                "style:display-name" => {
                    display_name = std::str::from_utf8(
                        &i.unescaped_value()
                            .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                    )
                    .unwrap_or("")
                    .to_string();
                }
                "style:default-outline-level" => {
                    let outline_level_raw = &i
                        .unescaped_value()
                        .unwrap_or_else(|_| std::borrow::Cow::from(vec![]));
                    let outline_level_str = std::str::from_utf8(outline_level_raw).unwrap_or("");
                    if outline_level_str != "" {
                        default_outline_level = Some(outline_level_str.parse::<u32>().unwrap_or(1));
                    }
                }
                _ => (),
            }
        }
    }
    if let Some(parent_style_name) = parent_style_name {
        (
            style_name,
            display_name,
            parent_style_name,
            default_outline_level,
        )
    } else {
        (style_name, display_name, family, default_outline_level)
    }
}

/// Takes the set of attributes of a style:style tag,
/// and returns the name of the style and the parent style name
/// Note: for use when parsing content.xml
fn style_begin(attributes: Attributes) -> (String, String) {
    let (style_name, _, parent_style_name, _) = style_begin_helper(attributes);
    (style_name, parent_style_name)
}

/// Takes the set of attributes of a style:style tag,
/// and returns the name of the style and the associated style object
/// Note: for use when parsing styles.xml
fn style_style_begin(attributes: Attributes) -> (String, Style) {
    let (style_name, display_name, parent_style_name, default_outline_level) =
        style_begin_helper(attributes);
    let mut element: Option<Element> = None;
    if let Some(default_outline_level) = default_outline_level {
        let heading = Heading::new_template(default_outline_level);
        element = Some(Element::Heading(heading));
    }
    (
        style_name,
        Style::new(display_name, Some(parent_style_name), element),
    )
}

/// Helper for handle_element_empty() to respond to tags with "style" prefix
/// local_name here is the name of the tag without the prefix
pub fn handle_element_empty_style(
    local_name: &str,
    attributes: Attributes,
    style: &mut HashMap<String, String>,
) {
    match local_name {
        "text-properties" => text_properties_begin(attributes, style),
        "table-column-properties" => table_column_properties_begin(attributes, style),
        "table-cell-properties" => table_cell_properties_begin(attributes, style),
        "table-properties" => table_properties_begin(attributes, style),
        _ => (),
    }
}

/// Helper for handle_element_start() to respond to tags with "style" prefix
/// local_name here is the name of the tag without the prefix
pub fn handle_element_start_style(
    local_name: &str,
    attributes: Attributes,
) -> (Option<String>, Option<HashMap<String, String>>) {
    let mut current_style_name: Option<String> = None;
    let mut current_style_value: HashMap<String, String> = HashMap::new();
    let mut is_valid = true;
    match local_name {
        "style" => {
            let (new_style_name, style_parent) = style_begin(attributes);
            current_style_name = Some(new_style_name);
            current_style_value.insert("_parent".to_string(), style_parent);
        }
        "table-row-properties" => table_row_properties_begin(attributes, &mut current_style_value),
        "table-properties" => table_properties_begin(attributes, &mut current_style_value),
        "table-cell-properties" => {
            table_cell_properties_begin(attributes, &mut current_style_value)
        }
        _ => is_valid = false,
    }
    if is_valid {
        (current_style_name, Some(current_style_value))
    } else {
        (current_style_name, None)
    }
}

/// Takes the set of attributes of a style:default-style tag,
/// and returns the name of the style and the associated style object
fn default_style_begin(attributes: Attributes) -> (String, Style) {
    let mut style_name = String::new();
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            if name == "style:family" {
                style_name = std::str::from_utf8(
                    &i.unescaped_value()
                        .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                )
                .unwrap_or("")
                .to_string();
            }
        }
    }
    // use an empty string as the displayed string for default styles for now
    (style_name, Style::new("".to_string(), None, None))
}
