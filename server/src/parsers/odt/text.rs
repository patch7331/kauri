use super::*;

impl ODTParser {
    /// Helper for handle_element_start() to respond to tags with "text" prefix
    pub fn handle_element_start_text(&mut self, local_name: &str, attributes: Attributes) {
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
    }

    /// Helper for handle_element_empty() to respond to tags with "text" prefix
    pub fn handle_element_empty_text(&mut self, local_name: &str, attributes: Attributes) {
        let mut child: Option<Element> = None;
        match local_name {
            "h" => {
                let (element, ..) = check_underline(
                    heading_begin(attributes),
                    &self.auto_styles,
                    !self.set_children_underline.is_empty()
                        && *self.set_children_underline.last().unwrap(),
                    !self.ensure_children_no_underline.is_empty()
                        && *self.ensure_children_no_underline.last().unwrap(),
                );
                child = Some(element);
            }
            "p" => {
                let (element, ..) = check_underline(
                    paragraph_begin(attributes),
                    &self.auto_styles,
                    !self.set_children_underline.is_empty()
                        && *self.set_children_underline.last().unwrap(),
                    !self.ensure_children_no_underline.is_empty()
                        && *self.ensure_children_no_underline.last().unwrap(),
                );
                child = Some(element);
            }
            "span" => {
                let (element, ..) = check_underline(
                    span_begin(attributes),
                    &self.auto_styles,
                    !self.set_children_underline.is_empty()
                        && *self.set_children_underline.last().unwrap(),
                    !self.ensure_children_no_underline.is_empty()
                        && *self.ensure_children_no_underline.last().unwrap(),
                );
                child = Some(element);
            }
            _ => (),
        }
        if let Some(element) = child {
            if self.document_hierarchy.is_empty() {
                self.document_root.children.push(Node::Element(element));
            } else {
                self.document_hierarchy
                    .last_mut()
                    .unwrap()
                    .children
                    .push(Node::Element(element));
            }
        }
    }
}

/// Takes the results of either heading_begin() or paragraph_begin() (called params)
/// and a reference to the map of automatic style names to the map of CSS properties,
/// and returns the element from params with its styles attached together
/// with the values for set_children_underline and ensure_children_no_underline in ODTParser
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
pub fn handle_underline(
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

/// Takes the set of attributes of a style:text-properties tag in the ODT's content.xml,
/// and creates a map of CSS properties based on the attributes
pub fn text_properties_begin(attributes: Attributes) -> HashMap<String, String> {
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
                text_properties_begin_fo(local_name, value, &mut map);
            } else if prefix == "style" && text_properties_begin_style(local_name, value, &mut map)
            {
                is_double_underline = true;
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

/// Helper for text_properties_begin() to respond to attributes with "fo" prefix
fn text_properties_begin_fo(local_name: &str, value: String, map: &mut HashMap<String, String>) {
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
}

/// Helper for text_properties_begin() to respond to attributes with "style" prefix,
/// returns true if the attribute indicates that the underline style should be a double underline,
/// returns false otherwise
fn text_properties_begin_style(
    local_name: &str,
    value: String,
    map: &mut HashMap<String, String>,
) -> bool {
    if local_name == "text-underline-style" {
        if value == "none" {
            map.insert("textDecorationLine".to_string(), "none".to_string());
        } else {
            map.insert("textDecorationLine".to_string(), "underline".to_string());
            match value.as_str() {
                "dash" => map.insert("textDecorationStyle".to_string(), "dashed".to_string()),
                "dotted" => map.insert("textDecorationStyle".to_string(), "dotted".to_string()),
                "wave" => map.insert("textDecorationStyle".to_string(), "wavy".to_string()),
                // There are a few possible styles in ODF that aren't present in CSS
                // (dot-dash, dot-dot-dash, long-dash), so just put in a basic underline?
                "solid" | _ => map.insert("textDecorationStyle".to_string(), "solid".to_string()),
            };
        }
    } else if local_name == "text-underline-type" && value == "double" {
        return true;
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
    false
}
