mod table;
mod text;

extern crate quick_xml;
extern crate serde_json;
extern crate zip;

use self::table::*;
use self::text::*;
use crate::document::node::{ChildNode, Element, Node, Text};
use crate::document::styles::Style;
use crate::document::styles::Styles;
use crate::document::Document;
use quick_xml::events::attributes::Attributes;
use quick_xml::events::Event;
use quick_xml::Reader;
use std::collections::HashMap;
use std::io::BufReader;

pub struct ODTParser {
    body_begin: bool,
    styles_begin: bool,
    table_column_number: Vec<u32>,
    table_row_number: Vec<u32>,
    auto_styles: HashMap<String, HashMap<String, String>>,
    set_children_underline: Vec<bool>,
    ensure_children_no_underline: Vec<bool>,
    document_root: Document,
    // document_hierarchy has Elements instead of ChildNodes, since Nodes can never have children
    document_hierarchy: Vec<Element>,
    table_column_default_style_names: Vec<Vec<String>>,
    table_row_default_style_names: Vec<Vec<String>>,
}

impl ODTParser {
    /// Initialises a new ODTParser instance
    pub fn new() -> ODTParser {
        let document_root = Document {
            content: Vec::new(),
            styles: Styles::new(),
            meta: None,
        };
        ODTParser {
            body_begin: false,
            styles_begin: false,
            table_column_number: Vec::new(),
            table_row_number: Vec::new(),
            auto_styles: HashMap::new(),
            set_children_underline: Vec::new(),
            ensure_children_no_underline: Vec::new(),
            document_root,
            document_hierarchy: Vec::new(),
            table_column_default_style_names: Vec::new(),
            table_row_default_style_names: Vec::new(),
        }
    }

    /// Parse the ODT file referenced by the file path
    pub fn parse(&mut self, filepath: &str) -> Result<String, String> {
        let archive = super::util::get_archive(filepath);
        // need to destructure and recreate the Err enum because the Result type is different
        if let Err(e) = archive {
            return Err(e);
        }
        let mut archive = archive.unwrap();
        if let Err(e) = self.parse_content(&mut archive) {
            return Err(format!("{}: {}", "Content parsing error", e));
        } else if let Err(e) = self.parse_styles(&mut archive) {
            return Err(format!("{}: {}", "Styles parsing error", e));
        } else {
            return Ok(self.document_root.to_json().unwrap());
        }
    }

    /// Parse content.xml inside the ODT
    fn parse_content(
        &mut self,
        archive: &mut zip::ZipArchive<std::fs::File>,
    ) -> Result<(), String> {
        // returns a ZipFile struct which implements Read if the file is in the archive
        let content_xml = archive.by_name("content.xml");
        if let Err(e) = content_xml {
            // Handle case where there is no content.xml (so probably not actually an ODT file)
            return Err(e.to_string());
        }
        let content_xml = BufReader::new(content_xml.unwrap()); //add buffering because quick-xml's reader requires it

        // These are here instead of the struct because we may need to move the contents of these somewhere else
        let mut current_style_name = String::new();
        let mut current_style_value: HashMap<String, String> = HashMap::new();

        let mut parser = Reader::from_reader(content_xml);
        let mut buffer = Vec::new();
        loop {
            // Iterate through the XML
            match parser.read_event(&mut buffer) {
                Ok(Event::Start(contents)) => {
                    let (current_style_name_new, current_style_value_new) = self
                        .handle_element_start(
                            std::str::from_utf8(contents.name()).unwrap_or(":"),
                            contents.attributes(),
                        );
                    if let Some(x) = current_style_name_new {
                        current_style_name = x;
                    }
                    if let Some(x) = current_style_value_new {
                        current_style_value = x;
                    }
                }
                Ok(Event::Text(contents)) => {
                    let contents = contents.unescape_and_decode(&parser);
                    if let Err(e) = contents {
                        println!("Content parsing error: {}", e);
                    } else {
                        self.handle_characters(contents.unwrap());
                    }
                }
                Ok(Event::End(contents)) => {
                    let result = self.handle_element_end(
                        std::str::from_utf8(contents.name()).unwrap_or(":"),
                        current_style_name,
                        current_style_value,
                    );
                    if let Some(x) = result {
                        // If they were not used inside handle_element_end() then put them back
                        let (current_style_name_new, current_style_value_new) = x;
                        current_style_name = current_style_name_new;
                        current_style_value = current_style_value_new;
                    } else {
                        // Otherwise reinitialise them
                        current_style_name = String::new();
                        current_style_value = HashMap::new();
                    }
                }
                Ok(Event::Empty(contents)) => {
                    self.handle_element_empty(
                        std::str::from_utf8(contents.name()).unwrap_or(":"),
                        contents.attributes(),
                        &mut current_style_value,
                    );
                }
                Ok(Event::Eof) => break,
                Err(e) => {
                    println!("Content parsing error: {}", e);
                    return Err(e.to_string());
                }
                _ => {}
            }
        }

        Ok(())
    }

    fn parse_styles(&mut self, archive: &mut zip::ZipArchive<std::fs::File>) -> Result<(), String> {
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

    /// Handles a StartElement event from the XML parser by taking its contents (only name and attributes needed)
    /// and returns the new values of current_style_name and current_style_value if either was set as a result
    /// as well as mutating internal state accordingly
    fn handle_element_start(
        &mut self,
        name: &str,
        attributes: Attributes,
    ) -> (Option<String>, Option<HashMap<String, String>>) {
        let (prefix, local_name) = name.split_at(name.find(':').unwrap_or(0));
        let local_name = &local_name[1..];
        match name {
            "office:body" => self.body_begin = true,
            _ if self.body_begin => {
                self.handle_element_start_body(prefix, local_name, attributes);
                return (None, None);
            }
            "office:automatic-styles" => self.styles_begin = true,
            _ if self.styles_begin && prefix == "style" => {
                return handle_element_start_style(local_name, attributes)
            }
            _ => (),
        }
        (None, None)
    }

    /// Helper for handle_element_start() to handle tags when in the body
    fn handle_element_start_body(
        &mut self,
        prefix: &str,
        local_name: &str,
        attributes: Attributes,
    ) {
        match prefix {
            "text" => self.handle_element_start_text(local_name, attributes),
            "table" => self.handle_element_start_table(local_name, attributes),
            _ => (),
        }
    }

    /// Handles an EmptyElement event from the XML parser by taking its contents (only name and attributes needed)
    /// and returns the new value of current_style_value if it was set as a result
    /// as well as mutating internal state accordingly
    fn handle_element_empty(
        &mut self,
        name: &str,
        attributes: Attributes,
        style: &mut HashMap<String, String>,
    ) {
        let (prefix, local_name) = name.split_at(name.find(':').unwrap_or(0));
        let local_name = &local_name[1..];
        match prefix {
            "style" => handle_element_empty_style(local_name, attributes, style),
            "text" => self.handle_element_empty_text(local_name, attributes),
            "table" => self.handle_element_empty_table(local_name, attributes),
            _ => (),
        }
    }

    /// Handles a Characters event from the XML parser by taking its contents
    /// and mutating internal state accordingly
    fn handle_characters(&mut self, contents: String) {
        // Apparently in between tags this will be called with an empty string, so ignore that
        if self.document_hierarchy.is_empty() || contents == "" {
            return;
        }
        // Currently the only type of tag expected to emit this event is the ones in the body,
        // in which case they will contain the document text
        let text = Text::new(contents);
        self.document_hierarchy
            .last_mut()
            .unwrap()
            .get_common()
            .children
            .push(ChildNode::Node(Node::Text(text)));
    }

    /// Handles an EndElement event from the XML parser by taking its contents (the name of the element),
    /// the style name and value of the current element and mutating internal state accordingly,
    /// then it will return the current_style_name and current_style_value back if they were not used
    fn handle_element_end(
        &mut self,
        name: &str,
        current_style_name: String,
        current_style_value: HashMap<String, String>,
    ) -> Option<(String, HashMap<String, String>)> {
        let (prefix, local_name) = name.split_at(name.find(':').unwrap_or(0));
        let local_name = &local_name[1..];
        if self.body_begin {
            if self.document_hierarchy.is_empty() {
                // It shouldn't be empty now, if it is then this is an unmatched end tag
                return Some((current_style_name, current_style_value));
            }
            if name == "office:body" {
                return Some((current_style_name, current_style_value));
            } else if prefix == "text"
                && (local_name == "h"
                    || local_name == "p"
                    || local_name == "span"
                    || local_name == "a")
            {
                // The top of set_children_underline and ensure_children_no_underline is for this node's children,
                // so pop them here before we finish up with this node
                self.set_children_underline.pop();
                self.ensure_children_no_underline.pop();
                let mut child = self.document_hierarchy.pop().unwrap();
                if local_name == "span" {
                    handle_underline(
                        &mut child.get_common().styles,
                        !self.set_children_underline.is_empty()
                            && *self.set_children_underline.last().unwrap(),
                        !self.ensure_children_no_underline.is_empty()
                            && *self.ensure_children_no_underline.last().unwrap(),
                    );
                }
                if self.document_hierarchy.is_empty() {
                    self.document_root.content.push(ChildNode::Element(child));
                } else {
                    self.document_hierarchy
                        .last_mut()
                        .unwrap()
                        .get_common()
                        .children
                        .push(ChildNode::Element(child));
                }
            } else if prefix == "table" {
                self.handle_element_end_table(local_name);
            }
        } else if self.styles_begin {
            if name == "office:automatic-styles" {
                self.styles_begin = false;
            } else if name == "style:style" {
                self.auto_styles
                    .insert(current_style_name, current_style_value);
                return None;
            }
        }
        Some((current_style_name, current_style_value))
    }
}

/// Takes the set of attributes of a style:style tag,
/// and returns the name of the style, the displayed name of the style and the parent style name
fn style_begin_helper(attributes: Attributes) -> (String, String, String) {
    let mut display_name = String::new();
    let mut style_name = String::new();
    let mut family = String::new();
    let mut parent_style_name: Option<String> = None;
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
                _ => (),
            }
        }
    }
    if let Some(parent_style_name) = parent_style_name {
        (style_name, display_name, parent_style_name)
    } else {
        (style_name, display_name, family)
    }
}

/// Takes the set of attributes of a style:style tag,
/// and returns the name of the style and the parent style name
/// Note: for use when parsing content.xml
fn style_begin(attributes: Attributes) -> (String, String) {
    let (style_name, _, parent_style_name) = style_begin_helper(attributes);
    (style_name, parent_style_name)
}

/// Takes the set of attributes of a style:style tag,
/// and returns the name of the style and the associated style object
/// Note: for use when parsing styles.xml
fn style_style_begin(attributes: Attributes) -> (String, Style) {
    let (style_name, display_name, parent_style_name) = style_begin_helper(attributes);
    (
        style_name,
        Style::new(display_name, Some(parent_style_name)),
    )
}

/// Helper for handle_element_empty() to respond to tags with "style" prefix
/// local_name here is the name of the tag without the prefix
fn handle_element_empty_style(
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
fn handle_element_start_style(
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
    (style_name, Style::new("".to_string(), None))
}
