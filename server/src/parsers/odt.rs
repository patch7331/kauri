extern crate quick_xml;
extern crate serde_json;
extern crate zip;

use crate::document::node::{Element, Node, Text};
use crate::document::units::DistanceUnit;
use crate::document::{Document, PaperSize};
use quick_xml::events::attributes::Attributes;
use quick_xml::events::Event;
use quick_xml::Reader;
use std::collections::HashMap;
use std::io::BufReader;

pub struct ODTParser {
    body_begin: bool,
    styles_begin: bool,
    auto_styles: HashMap<String, HashMap<String, String>>,
    set_children_underline: Vec<bool>,
    ensure_children_no_underline: Vec<bool>,
    document_root: Document,
    document_hierarchy: Vec<Element>,
}

impl ODTParser {
    /// Initialises a new ODTParser instance
    pub fn new() -> ODTParser {
        let document_root = Document::new(
            "Kauri (Working Title)".to_string(),
            PaperSize::new(297, 210, DistanceUnit::Millimetres),
        );
        let document_hierarchy: Vec<Element> = Vec::new();
        ODTParser {
            body_begin: false,
            styles_begin: false,
            auto_styles: HashMap::new(),
            set_children_underline: Vec::new(),
            ensure_children_no_underline: Vec::new(),
            document_root,
            document_hierarchy,
        }
    }

    /// Parse the ODT file referenced by the file path
    pub fn parse(&mut self, filepath: &str) -> Result<String, String> {
        let archive = super::util::get_archive(filepath);
        if let Err(e) = archive {
            return Err(e.to_string());
        }
        let archive = archive.unwrap();
        self.parse_private(archive)
    }

    /// Actually parse the file, this is a separate function so we actually own the archive here
    fn parse_private(
        &mut self,
        mut archive: zip::ZipArchive<std::fs::File>,
    ) -> Result<String, String> {
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
                        println!("Error: {}", e);
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
                    let current_style_value_new = self.handle_element_empty(
                        std::str::from_utf8(contents.name()).unwrap_or(":"),
                        contents.attributes(),
                    );
                    if let Some(x) = current_style_value_new {
                        current_style_value = x;
                    }
                }
                Ok(Event::Eof) => break,
                Err(e) => {
                    println!("Error: {}", e);
                    return Err(e.to_string());
                }
                _ => {}
            }
        }

        Ok(self.document_root.to_json().unwrap())
    }

    /// Handles a StartElement event from the XML parser by taking its contents (only name and attributes needed)
    /// and returns the new values of current_style_name and current_style_value if either was set as a result
    /// as well as mutating internal state accordingly
    fn handle_element_start(
        &mut self,
        name: &str,
        attributes: Attributes,
    ) -> (Option<String>, Option<HashMap<String, String>>) {
        let mut current_style_name: Option<String> = None;
        let mut current_style_value: Option<HashMap<String, String>> = None;
        let (prefix, local_name) = name.split_at(name.find(':').unwrap_or(0));
        let local_name = &local_name[1..];
        if name == "office:body" {
            self.body_begin = true;
        } else if self.body_begin {
            if prefix != "text" {
                return (current_style_name, current_style_value);
            }
            match local_name {
                "h" => {
                    let (element, set_children_underline_new, ensure_children_no_underline_new) =
                        check_underline(
                            heading_begin(attributes),
                            &self.auto_styles,
                            !self.set_children_underline.is_empty()
                                && *self.set_children_underline.last().unwrap(),
                            !self.ensure_children_no_underline.is_empty()
                                && *self.ensure_children_no_underline.last().unwrap(),
                        );
                    self.ensure_children_no_underline
                        .push(ensure_children_no_underline_new);
                    self.set_children_underline.push(set_children_underline_new);
                    self.document_hierarchy.push(element);
                }
                "p" => {
                    let (element, set_children_underline_new, ensure_children_no_underline_new) =
                        check_underline(
                            paragraph_begin(attributes),
                            &self.auto_styles,
                            !self.set_children_underline.is_empty()
                                && *self.set_children_underline.last().unwrap(),
                            !self.ensure_children_no_underline.is_empty()
                                && *self.ensure_children_no_underline.last().unwrap(),
                        );
                    self.ensure_children_no_underline
                        .push(ensure_children_no_underline_new);
                    self.set_children_underline.push(set_children_underline_new);
                    self.document_hierarchy.push(element);
                }
                "span" => {
                    let (element, set_children_underline_new, ensure_children_no_underline_new) =
                        check_underline(
                            span_begin(attributes),
                            &self.auto_styles,
                            !self.set_children_underline.is_empty()
                                && *self.set_children_underline.last().unwrap(),
                            !self.ensure_children_no_underline.is_empty()
                                && *self.ensure_children_no_underline.last().unwrap(),
                        );
                    self.ensure_children_no_underline
                        .push(ensure_children_no_underline_new);
                    self.set_children_underline.push(set_children_underline_new);
                    self.document_hierarchy.push(element);
                }
                _ => (),
            }
        } else if name == "office:automatic-styles" {
            self.styles_begin = true;
        } else if self.styles_begin && name == "style:style" {
            current_style_name = Some(style_begin(attributes));
        } else if name == "style:table-row-properties" {
            current_style_value = Some(table_row_properties_begin(attributes));
        } else if name == "style:table-properties" {
            current_style_value = Some(table_properties_begin(attributes))
        }
        (current_style_name, current_style_value)
    }

    /// Handles an EmptyElement event from the XML parser by taking its contents (only name and attributes needed)
    /// and returns the new value of current_style_value if it was set as a result
    /// as well as mutating internal state accordingly
    fn handle_element_empty(
        &mut self,
        name: &str,
        attributes: Attributes,
    ) -> Option<HashMap<String, String>> {
        if name == "style:text-properties" {
            Some(text_properties_begin(attributes))
        } else if name == "style:table-column-properties" {
            Some(table_column_properties_begin(attributes))
        } else {
            None
        }
    }

    /// Handles a Characters event from the XML parser by taking its contents
    /// and mutating internal state accordingly
    fn handle_characters(&mut self, contents: String) {
        if self.document_hierarchy.is_empty() {
            return;
        }
        // Currently the only type of tag expected to emit this event is the ones in the body,
        // in which case they will contain the document text
        let text = Text::new(contents);
        self.document_hierarchy
            .last_mut()
            .unwrap()
            .children
            .push(Node::Text(text));
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
            if name == "office:body" {
                return Some((current_style_name, current_style_value));
            } else if prefix == "text"
                && (local_name == "h" || local_name == "p" || local_name == "span")
            {
                if self.document_hierarchy.is_empty() {
                    // It shouldn't be empty now, if it is then this is an unmatched end tag
                    return Some((current_style_name, current_style_value));
                }
                // The top of set_children_underline and ensure_children_no_underline is for this node's children,
                // so pop them here before we finish up with this node
                self.set_children_underline.pop();
                self.ensure_children_no_underline.pop();
                let mut child = self.document_hierarchy.pop().unwrap();
                if local_name == "span" {
                    handle_underline(
                        &mut child.styles,
                        !self.set_children_underline.is_empty()
                            && *self.set_children_underline.last().unwrap(),
                        !self.ensure_children_no_underline.is_empty()
                            && *self.ensure_children_no_underline.last().unwrap(),
                    );
                }
                if self.document_hierarchy.is_empty() {
                    self.document_root.children.push(Node::Element(child));
                } else {
                    self.document_hierarchy
                        .last_mut()
                        .unwrap()
                        .children
                        .push(Node::Element(child));
                }
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

/// Takes the results of either heading_begin() or paragraph_begin() (called params)
/// and a reference to the map of automatic style names to the map of CSS properties,
/// and returns the element from params together with the values for set_children_underline
/// and ensure_children_no_underline in ODTParser
fn check_underline(
    params: (Element, String),
    auto_styles: &HashMap<String, HashMap<String, String>>,
    set_children_underline_old: bool,
    ensure_children_no_underline_old: bool,
) -> (Element, bool, bool) {
    let mut ensure_children_no_underline = ensure_children_no_underline_old;
    let mut set_children_underline = set_children_underline_old;
    let (mut element, style_name) = params;
    let style = auto_styles
        .get(&style_name)
        .unwrap_or(&HashMap::new())
        .clone();
    let underline = style.get("textDecorationLine");
    let underline_color = style.get("textDecorationColor");
    if let Some(x) = underline {
        if x == "underline" {
            ensure_children_no_underline = true;
            if let Some(x) = underline_color {
                set_children_underline = x == "currentcolor";
            }
        } else if x == "none" {
            ensure_children_no_underline = false;
        }
    }
    element.styles = style;
    (
        element,
        set_children_underline,
        ensure_children_no_underline,
    )
}

/// Takes a mutable reference to a map of CSS style properties to values and 2 booleans
/// (the boolean results of check_underline()), and adds an extra CSS property to
/// handle some special cases related to underlines if needed depending on the booleans
fn handle_underline(
    style_map: &mut HashMap<String, String>,
    set_children_underline: bool,
    ensure_children_no_underline: bool,
) {
    if set_children_underline {
        if let Some(x) = style_map.get("textDecorationLine") {
            if x != "none" {
                style_map.insert("textDecorationLine".to_string(), "underline".to_string());
            } else if ensure_children_no_underline {
                // Need this to make sure the underline is actually not there, because CSS things
                style_map.insert("display".to_string(), "inline-block".to_string());
            }
        } else {
            style_map.insert("textDecoration".to_string(), "underline".to_string());
        }
    } else if ensure_children_no_underline {
        if let Some(x) = style_map.get("textDecorationLine") {
            if x == "none" {
                // Need this to make sure the underline is actually not there, because CSS things
                style_map.insert("display".to_string(), "inline-block".to_string());
            }
        }
    }
}

/// Takes the set of attributes of a text:h tag in the ODT's content.xml,
/// and returns a heading element based on the attributes,
/// together with the value of the text:style-name attribute of the tag
fn heading_begin(attributes: Attributes) -> (Element, String) {
    // Because JS numbers are always floats apparently
    let mut level = 0.0;
    let mut style_name = String::new();
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            if name == "text:outline-level" {
                level = std::str::from_utf8(
                    &i.unescaped_value()
                        .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                )
                .unwrap_or("1")
                .parse::<f64>()
                .unwrap_or(1.0);
            } else if name == "text:style-name" {
                style_name = std::str::from_utf8(
                    &i.unescaped_value()
                        .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                )
                .unwrap_or("")
                .to_string();
            }
        }
    }
    let mut element = Element::new("heading".to_string());
    element
        .attributes
        .insert("level".to_string(), level.to_string());
    (element, style_name)
}

/// Takes the set of attributes of a text:p tag in the ODT's content.xml,
/// and returns a paragraph element together with the value of the text:style-name attribute of the tag
fn paragraph_begin(attributes: Attributes) -> (Element, String) {
    let mut style_name = String::new();
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            if name == "text:style-name" {
                style_name = std::str::from_utf8(
                    &i.unescaped_value()
                        .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                )
                .unwrap_or("")
                .to_string();
            }
        }
    }
    (Element::new("paragraph".to_string()), style_name)
}

/// Takes the set of attributes of a text:span tag in the ODT's content.xml
/// and returns a span element together with the value of the text:style-name attribute of the tag
fn span_begin(attributes: Attributes) -> (Element, String) {
    let mut style_name = String::new();
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            if name == "text:style-name" {
                style_name = std::str::from_utf8(
                    &i.unescaped_value()
                        .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                )
                .unwrap_or("")
                .to_string();
            }
        }
    }
    (Element::new("span".to_string()), style_name)
}

/// Takes the set of attributes of a style:style tag in the ODT's content.xml,
/// and returns the name of the style
fn style_begin(attributes: Attributes) -> String {
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            if name == "style:name" {
                return std::str::from_utf8(
                    &i.unescaped_value()
                        .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
                )
                .unwrap_or("")
                .to_string();
            }
        }
    }
    String::new()
}

/// Takes the set of attributes of a style:text-properties tag in the ODT's content.xml,
/// and creates a map of CSS properties based on the attributes
fn text_properties_begin(attributes: Attributes) -> HashMap<String, String> {
    let mut map: HashMap<String, String> = HashMap::new();
    let mut is_double_underline = false;
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            let (prefix, local_name) = name.split_at(name.find(':').unwrap_or(0));
            let local_name = &local_name[1..];
            let value = std::str::from_utf8(
                &i.unescaped_value()
                    .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
            )
            .unwrap_or("what")
            .to_string();
            if prefix == "fo" {
                if local_name == "font-weight" {
                    // All valid values for this attribute is also valid in the CSS equivalent, so just use it as is
                    map.insert("fontWeight".to_string(), value);
                } else if local_name == "font-style" && value != "backslant" {
                    // `backslant` is not valid in CSS, but all the other ones are
                    map.insert("fontStyle".to_string(), value);
                } else if local_name == "color" {
                    map.insert("color".to_string(), value);
                } else if local_name == "font-size" {
                    map.insert("fontSize".to_string(), value);
                }
            } else if prefix == "style" {
                if local_name == "text-underline-style" {
                    if value == "none" {
                        map.insert("textDecorationLine".to_string(), "none".to_string());
                    } else {
                        map.insert("textDecorationLine".to_string(), "underline".to_string());
                        match value.as_str() {
                            "dash" => {
                                map.insert("textDecorationStyle".to_string(), "dashed".to_string())
                            }
                            "dotted" => {
                                map.insert("textDecorationStyle".to_string(), "dotted".to_string())
                            }
                            "wave" => {
                                map.insert("textDecorationStyle".to_string(), "wavy".to_string())
                            }
                            // There are a few possible styles in ODF that aren't present in CSS
                            // (dot-dash, dot-dot-dash, long-dash), so just put in a basic underline?
                            "solid" | _ => {
                                map.insert("textDecorationStyle".to_string(), "solid".to_string())
                            }
                        };
                    }
                } else if local_name == "text-underline-type" && value == "double" {
                    is_double_underline = true;
                } else if local_name == "text-underline-color" {
                    if value == "font-color" {
                        map.insert(
                            "textDecorationColor".to_string(),
                            "currentcolor".to_string(),
                        );
                    } else {
                        // The other valid values are all in hex format
                        map.insert("textDecorationColor".to_string(), value);
                    }
                } else if local_name == "font-name" {
                    map.insert("fontFamily".to_string(), value);
                }
            }
        }
    }
    if is_double_underline {
        // The ODT standard supports double underlines of any kind (solid, dotted, etc), while CSS
        // only supports double solid underlines, so prioritize the double over the line style?
        map.insert("textDecorationStyle".to_string(), "double".to_string());
    }
    map
}

enum TableAlign {
    Center,
    Left,
    Right,
    Margins,
}

/// Takes the set of attributes of a style:table-properties tag in the ODT's content.xml,
/// and creates a map of CSS properties based on the attributes
fn table_properties_begin(attributes: Attributes) -> HashMap<String, String> {
    let mut map: HashMap<String, String> = HashMap::new();
    let mut table_alignment = TableAlign::Margins;
    let mut margin_left = "0cm".to_string();
    let mut margin_right = "0cm".to_string();
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            let (prefix, local_name) = name.split_at(name.find(':').unwrap_or(0));
            let local_name = &local_name[1..];
            let value = std::str::from_utf8(
                &i.unescaped_value()
                    .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
            )
            .unwrap_or("what")
            .to_string();
            if prefix == "fo" {
                match local_name {
                    "background-color" => {
                        map.insert("fontWeight".to_string(), value);
                    }
                    "break-after" => {
                        if value == "auto" || value == "column" || value == "page" {
                            map.insert("breakAfter".to_string(), value);
                        }
                    }
                    "break-before" => {
                        if value == "auto" || value == "column" || value == "page" {
                            map.insert("breakBefore".to_string(), value);
                        }
                    }
                    "margin" => {
                        let margin_split = value.clone();
                        let mut margin_split = margin_split.split(' ');
                        let right = margin_split.nth(1);
                        let left = margin_split.nth(1);
                        margin_left = left.unwrap_or("0cm").to_string();
                        margin_right = right.unwrap_or("0cm").to_string();
                        map.insert("margin".to_string(), value);
                    }
                    "margin-top" => {
                        map.insert("marginTop".to_string(), value);
                    }
                    "margin-bottom" => {
                        map.insert("marginLeft".to_string(), value);
                    }
                    "margin-left" => {
                        margin_left = value.clone();
                        map.insert("marginRight".to_string(), value);
                    }
                    "margin-right" => {
                        margin_right = value.clone();
                        map.insert("marginBottom".to_string(), value);
                    }
                    _ => (),
                }
            } else if prefix == "style" {
                match local_name {
                    "rel-width" | "width" => {
                        map.insert("width".to_string(), value);
                    }
                    "shadow" => {
                        map.insert("boxShadow".to_string(), value);
                    }
                    "writing-mode" => {
                        match value.as_str() {
                            // According to the MDN the replacement for "rl" and "rl-tb" is also "horizontal-tb" apparently
                            "lr-tb" | "lr" | "rl" | "rl-tb" => {
                                map.insert("writingMode".to_string(), "horizontal-tb".to_string());
                            }
                            // MDN says "tb" is supposed to be replaced by "vertical-lr", but the ODT definition says that "tb" is a synonym for "tb-rl"
                            "tb-rl" | "tb" => {
                                map.insert("writingMode".to_string(), "vertical-rl".to_string());
                            }
                            "tb-lr" => {
                                map.insert("writingMode".to_string(), "vertical-lr".to_string());
                            }
                            _ => (),
                        }
                    }
                    _ => (),
                }
            } else if prefix == "table" {
                match local_name {
                    "align" => match value.as_str() {
                        "center" => table_alignment = TableAlign::Center,
                        "left" => table_alignment = TableAlign::Left,
                        "right" => table_alignment = TableAlign::Right,
                        "margins" => table_alignment = TableAlign::Margins,
                        _ => (),
                    },
                    "border-model" => match value.as_str() {
                        "collapsing" => {
                            map.insert("borderCollapse".to_string(), "collapse".to_string());
                        }
                        "separating" => {
                            map.insert("borderCollapse".to_string(), "separate".to_string());
                        }
                        _ => (),
                    },
                    "display" => {
                        if value == "false" {
                            map.insert("display".to_string(), "none".to_string());
                        }
                    }
                    _ => (),
                }
            }
        }
    }
    match table_alignment {
        // The specification says to ignore the right margin if it is aligned left
        TableAlign::Left => {
            map.insert("marginRight".to_string(), "unset".to_string());
        }
        // Similarly for align right
        TableAlign::Right => {
            map.insert("marginLeft".to_string(), "unset".to_string());
        }
        // For center alignment we are supposed to ignore both side margins, while in CSS centering is done by making both of them auto
        TableAlign::Center => {
            map.insert("marginLeft".to_string(), "auto".to_string());
            map.insert("marginRight".to_string(), "auto".to_string());
        }
        TableAlign::Margins => {
            map.insert(
                "width".to_string(),
                format!("calc(100% - {} - {})", margin_left, margin_right),
            );
        }
    }
    map
}

/// Takes the set of attributes of a style:table-column-properties tag in the ODT's content.xml,
/// and creates a map of CSS properties based on the attributes
fn table_column_properties_begin(attributes: Attributes) -> HashMap<String, String> {
    let mut map: HashMap<String, String> = HashMap::new();
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            let value = std::str::from_utf8(
                &i.unescaped_value()
                    .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
            )
            .unwrap_or("what")
            .to_string();
            match name {
                "fo:break-after" => {
                    if value == "auto" || value == "column" || value == "page" {
                        map.insert("breakAfter".to_string(), value);
                    }
                }
                "fo:break-before" => {
                    if value == "auto" || value == "column" || value == "page" {
                        map.insert("breakBefore".to_string(), value);
                    }
                }
                "style:column-width" => {
                    map.insert("width".to_string(), value);
                }
                "style:use-optimal-column-width" => {
                    if value == "true" {
                        map.insert("width".to_string(), "auto".to_string());
                    }
                }
                _ => (),
            }
        }
    }
    map
}

/// Takes the set of attributes of a style:table-row-properties tag in the ODT's content.xml,
/// and creates a map of CSS properties based on the attributes
fn table_row_properties_begin(attributes: Attributes) -> HashMap<String, String> {
    let mut map: HashMap<String, String> = HashMap::new();
    for i in attributes {
        if let Ok(i) = i {
            let name = std::str::from_utf8(i.key).unwrap_or(":");
            let value = std::str::from_utf8(
                &i.unescaped_value()
                    .unwrap_or_else(|_| std::borrow::Cow::from(vec![])),
            )
            .unwrap_or("what")
            .to_string();
            match name {
                "fo:break-after" => {
                    if value == "auto" || value == "column" || value == "page" {
                        map.insert("breakAfter".to_string(), value);
                    }
                }
                "fo:break-before" => {
                    if value == "auto" || value == "column" || value == "page" {
                        map.insert("breakBefore".to_string(), value);
                    }
                }
                "style:row-height" => {
                    map.insert("height".to_string(), value);
                }
                "style:use-optimal-row-height" => {
                    if value == "true" {
                        map.insert("height".to_string(), "auto".to_string());
                    }
                }
                "style:min-row-height" => {
                    map.insert("min-height".to_string(), value);
                }
                _ => (),
            }
        }
    }
    map
}
