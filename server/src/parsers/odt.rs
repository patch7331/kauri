extern crate serde_json;
extern crate xml;
extern crate zip;

use serde_json::map::Map;
use serde_json::value::Value;
use serde_json::Number;
use std::fs;
use xml::reader::{EventReader, XmlEvent};

pub struct ODTParser {
    body_begin: bool,
    styles_begin: bool,
    auto_styles: Map<String, Value>,
    is_span: bool,
    current_span_style: String,
    set_children_underline: bool,
    ensure_children_no_underline: bool,
    document_hierarchy: Vec<Value>,
    archive: zip::ZipArchive<std::fs::File>,
}

impl ODTParser {
    /// Initialises the struct's members given the path of an ODT file,
    /// can return an error if there is an issue with the file
    pub fn new(filepath: &str) -> Result<ODTParser, String> {
        let archive = get_archive(filepath);
        if let Err(e) = archive {
            return Err(e);
        }
        let archive = archive.unwrap();

        let mut document_contents: Map<String, Value> = Map::new(); //value of the "document" key
        document_contents.insert(
            "title".to_string(),
            Value::String("Kauri (Working title)".to_string()),
        );
        document_contents.insert("paper".to_string(), Value::String("A4".to_string()));
        document_contents.insert("children".to_string(), Value::Array(Vec::new()));

        // in case of nested tags, not actually handled yet
        let mut document_hierarchy: Vec<Value> = Vec::new();
        document_hierarchy.push(Value::Object(document_contents));

        Ok(ODTParser {
            body_begin: false,
            styles_begin: false,
            auto_styles: Map::new(),
            is_span: false,
            current_span_style: String::new(),
            set_children_underline: false,
            ensure_children_no_underline: false,
            document_hierarchy,
            archive,
        })
    }

    /// Actually parses the ODT file and returns a JSON representation of it
    pub fn parse(&mut self) -> Result<String, String> {
        // returns a ZipFile struct which implements Read if the file is in the archive
        let content_xml = self.archive.by_name("content.xml");
        if let Err(e) = content_xml {
            // Handle case where there is no content.xml (so probably not actually an ODT file)
            return Err(e.to_string());
        }

        // These are here instead of the struct because we may need to move the contents of these somewhere else
        let mut current_value = Value::Null;
        let mut current_style_name = String::new();
        let mut current_style_value = Value::Object(Map::new()); //in case there is a style definition with nothing we can parse

        let parser = EventReader::new(content_xml.unwrap());
        for e in parser {
            // Iterate through the XML
            match e {
                Ok(XmlEvent::StartElement {
                    name, attributes, ..
                }) => {
                    if let Some(prefix) = name.prefix {
                        if prefix == "office" && name.local_name == "body" {
                            self.body_begin = true;
                        } else if self.body_begin {
                            if prefix != "text" {
                                continue;
                            }
                            match name.local_name.as_str() {
                                "h" => {
                                    let (
                                        map,
                                        ensure_children_no_underline_new,
                                        set_children_underline_new,
                                    ) = check_underline(
                                        heading_begin(attributes),
                                        &self.auto_styles,
                                    );
                                    self.ensure_children_no_underline =
                                        ensure_children_no_underline_new;
                                    self.set_children_underline = set_children_underline_new;
                                    current_value = Value::Object(map);
                                }
                                "p" => {
                                    let (
                                        map,
                                        ensure_children_no_underline_new,
                                        set_children_underline_new,
                                    ) = check_underline(
                                        paragraph_begin(attributes),
                                        &self.auto_styles,
                                    );
                                    self.ensure_children_no_underline =
                                        ensure_children_no_underline_new;
                                    self.set_children_underline = set_children_underline_new;
                                    current_value = Value::Object(map);
                                }
                                "span" => {
                                    self.is_span = true;
                                    self.current_span_style = span_begin(attributes);
                                }
                                _ => (),
                            }
                        } else if prefix == "office" && name.local_name == "automatic-styles" {
                            self.styles_begin = true;
                        } else if self.styles_begin {
                            if prefix == "style" && name.local_name == "style" {
                                current_style_name = style_begin(attributes);
                            } else if prefix == "style" && name.local_name == "text-properties" {
                                current_style_value =
                                    Value::Object(text_properties_begin(attributes));
                            }
                        }
                    }
                }
                Ok(XmlEvent::Characters(contents)) => {
                    /*
                        Currently the only type of tag expected to emit this event is the ones in the body,
                        in which case they will contain the document text
                    */
                    let mut map: Map<String, Value> = Map::new();
                    map.insert("type".to_string(), Value::String("text".to_string()));
                    map.insert("content".to_string(), Value::String(contents));
                    if self.is_span {
                        let mut style = self
                            .auto_styles
                            .get(&self.current_span_style)
                            .unwrap_or(&Value::Object(Map::new())) //in case the style isn't there somehow
                            .clone();
                        let style_map = style.as_object_mut().unwrap();
                        handle_underline(
                            style_map,
                            self.set_children_underline,
                            self.ensure_children_no_underline,
                        );
                        map.insert("style".to_string(), style);
                        self.current_span_style = String::new();
                        self.is_span = false;
                    }
                    add_to_children(&mut current_value, Value::Object(map));
                }
                Ok(XmlEvent::EndElement { name }) => {
                    if self.body_begin {
                        if let Some(prefix) = name.prefix {
                            if prefix == "office" && name.local_name == "body" {
                                break;
                            } else if prefix == "text"
                                && (name.local_name == "h" || name.local_name == "p")
                            {
                                add_to_children(
                                    self.document_hierarchy.last_mut().unwrap(),
                                    current_value,
                                );
                                current_value = Value::Null;
                                self.set_children_underline = false;
                                self.ensure_children_no_underline = false;
                            }
                        }
                    } else if self.styles_begin {
                        if let Some(prefix) = name.prefix {
                            if prefix == "office" && name.local_name == "automatic-styles" {
                                self.styles_begin = false;
                            } else if prefix == "style" && name.local_name == "style" {
                                self.auto_styles
                                    .insert(current_style_name, current_style_value);
                                current_style_name = String::from("");
                                current_style_value = Value::Object(Map::new());
                            }
                        }
                    }
                }
                Err(e) => {
                    println!("Error: {}", e);
                    return Err(e.to_string());
                }
                _ => {}
            }
        }

        let mut document_object: Map<String, Value> = Map::new();
        document_object.insert(
            "document".to_string(),
            self.document_hierarchy.pop().unwrap(),
        );
        let document_object = Value::Object(document_object);
        Ok(serde_json::to_string(&document_object).unwrap())
    }
}

fn add_to_children(parent: &mut Value, object: Value) {
    parent
        .as_object_mut()
        .unwrap()
        .get_mut("children")
        .unwrap()
        .as_array_mut()
        .unwrap()
        .push(object);
}

/// Takes a path to a file and returns a ZipArchive representation of it.
/// This will make sure that the file is actually a zip file but will fail
/// if the file does not exist
fn get_archive(filepath: &str) -> Result<zip::ZipArchive<std::fs::File>, String> {
    let file = fs::File::open(&std::path::Path::new(&filepath)).unwrap();
    let archive = zip::ZipArchive::new(file);
    if let Err(e) = archive {
        // Handle case where the file is not even a zip file
        return Result::Err(e.to_string());
    }
    let archive = archive.unwrap();
    Result::Ok(archive)
}

/// Takes the results of either heading_begin() or paragraph_begin() (called params)
/// and a reference to the map of automatic style names to the JSON style object,
/// and returns the map from params together with the values for ensure_children_no_underline
/// and set_children_underline in parse_odt()
fn check_underline(
    params: (Map<String, Value>, String),
    auto_styles: &Map<String, Value>,
) -> (Map<String, Value>, bool, bool) {
    let mut ensure_children_no_underline = false;
    let mut set_children_underline = false;
    let (mut map, style_name) = params;
    let style = auto_styles
        .get(&style_name)
        .unwrap_or(&Value::Object(Map::new()))
        .clone();
    let style_map = style.as_object().unwrap();
    let underline = style_map.get("textDecorationLine");
    let underline_color = style_map.get("textDecorationColor");
    if let Some(x) = underline {
        if x.as_str().unwrap() == "underline" {
            ensure_children_no_underline = true;
            if let Some(x) = underline_color {
                if x.as_str().unwrap() == "currentcolor" {
                    set_children_underline = true;
                }
            }
        }
    }
    map.insert("style".to_string(), style);
    (map, ensure_children_no_underline, set_children_underline)
}

/// Takes a mutable reference to a map of CSS style properties to values and 2 booleans
/// (the boolean results of check_underline()), and adds an extra CSS property to
/// handle some special cases related to underlines if needed depending on the booleans
fn handle_underline(
    style_map: &mut Map<String, Value>,
    set_children_underline: bool,
    ensure_children_no_underline: bool,
) {
    if set_children_underline {
        if let Some(x) = style_map.get("textDecorationLine") {
            if x.as_str().unwrap() != "none" {
                style_map.insert(
                    "textDecorationLine".to_string(),
                    Value::String("underline".to_string()),
                );
            } else if ensure_children_no_underline {
                // Need this to make sure the underline is actually not there, because CSS things
                style_map.insert(
                    "display".to_string(),
                    Value::String("inline-block".to_string()),
                );
            }
        } else {
            style_map.insert(
                "textDecoration".to_string(),
                Value::String("underline".to_string()),
            );
        }
    } else if ensure_children_no_underline {
        if let Some(x) = style_map.get("textDecorationLine") {
            if x.as_str().unwrap() == "none" {
                // Need this to make sure the underline is actually not there, because CSS things
                style_map.insert(
                    "display".to_string(),
                    Value::String("inline-block".to_string()),
                );
            }
        }
    }
}

/// Takes the set of attributes of a text:h tag in the ODT's content.xml,
/// and returns a map for use in a Value::Object enum that represents a heading element based on the attributes,
/// together with the value of the text:style-name attribute of the tag
fn heading_begin(attributes: Vec<xml::attribute::OwnedAttribute>) -> (Map<String, Value>, String) {
    // Because JS numbers are always floats apparently
    let mut level = 0.0;
    let mut style_name = String::new();
    for i in attributes {
        let prefix = i.name.prefix.unwrap_or_else(|| "".to_string());
        if prefix == "text" && i.name.local_name == "outline-level" {
            level = i.value.parse::<f64>().unwrap_or(1.0);
        } else if prefix == "text" && i.name.local_name == "style-name" {
            style_name = i.value;
        }
    }
    let mut map: Map<String, Value> = Map::new();
    map.insert("type".to_string(), Value::String("heading".to_string()));
    map.insert(
        "level".to_string(),
        Value::Number(Number::from_f64(level).unwrap()),
    );
    map.insert("children".to_string(), Value::Array(Vec::new()));
    (map, style_name)
}

/// Takes the set of attributes of a text:p tag in the ODT's content.xml,
/// and returns a map for use in a Value::Object enum that represents a heading element
/// together with the value of the text:style-name attribute of the tag
fn paragraph_begin(
    attributes: Vec<xml::attribute::OwnedAttribute>,
) -> (Map<String, Value>, String) {
    let mut style_name = String::new();
    for i in attributes {
        if i.name.prefix.unwrap_or_else(|| "".to_string()) == "text"
            && i.name.local_name == "style-name"
        {
            style_name = i.value;
        }
    }
    let mut map: Map<String, Value> = Map::new();
    map.insert("type".to_string(), Value::String("paragraph".to_string()));
    map.insert("children".to_string(), Value::Array(Vec::new()));
    (map, style_name)
}

/// Takes the set of attributes of a text:span tag in the ODT's content.xml
/// and returns the value of the text:style-name attribute of the tag
fn span_begin(attributes: Vec<xml::attribute::OwnedAttribute>) -> String {
    let mut style_name = String::new();
    for i in attributes {
        if i.name.prefix.unwrap_or_else(|| "".to_string()) == "text"
            && i.name.local_name == "style-name"
        {
            style_name = i.value;
        }
    }
    style_name
}

/// Takes the set of attributes of a style:style tag in the ODT's content.xml,
/// and returns the name of the style
fn style_begin(attributes: Vec<xml::attribute::OwnedAttribute>) -> String {
    for i in attributes {
        if i.name.prefix.unwrap_or_else(|| "".to_string()) == "style" && i.name.local_name == "name"
        {
            return i.value;
        }
    }
    String::new()
}

/// Takes the set of attributes of a style:text-properties tag in the ODT's content.xml,
/// and creates a map for use in a Value::Object enum that represents a style object based on the attributes
fn text_properties_begin(attributes: Vec<xml::attribute::OwnedAttribute>) -> Map<String, Value> {
    let mut map: Map<String, Value> = Map::new();
    let mut is_double_underline = false;
    for i in attributes {
        let prefix = i.name.prefix.unwrap_or_else(|| "".to_string());
        if prefix == "fo" {
            if i.name.local_name == "font-weight" {
                // All valid values for this attribute is also valid in the CSS equivalent, so just use it as is
                map.insert("fontWeight".to_string(), Value::String(i.value));
            } else if i.name.local_name == "font-style" && i.value != "backslant" {
                // `backslant` is not valid in CSS, but all the other ones are
                map.insert("fontStyle".to_string(), Value::String(i.value));
            } else if i.name.local_name == "color" {
                map.insert("color".to_string(), Value::String(i.value));
            } else if i.name.local_name == "font-size" {
                map.insert("font-size".to_string(), Value::String(i.value));
            }
        } else if prefix == "style" {
            if i.name.local_name == "text-underline-style" {
                if i.value == "none" {
                    map.insert(
                        "textDecorationLine".to_string(),
                        Value::String("none".to_string()),
                    );
                } else {
                    map.insert(
                        "textDecorationLine".to_string(),
                        Value::String("underline".to_string()),
                    );
                    match i.value.as_ref() {
                        "dash" => map.insert(
                            "textDecorationStyle".to_string(),
                            Value::String("dashed".to_string()),
                        ),
                        "dotted" => map.insert(
                            "textDecorationStyle".to_string(),
                            Value::String("dotted".to_string()),
                        ),
                        "wave" => map.insert(
                            "textDecorationStyle".to_string(),
                            Value::String("wavy".to_string()),
                        ),
                        // There are a few possible styles in ODF that aren't present in CSS
                        // (dot-dash, dot-dot-dash, long-dash), so just put in a basic underline?
                        "solid" | _ => map.insert(
                            "textDecorationStyle".to_string(),
                            Value::String("solid".to_string()),
                        ),
                    };
                }
            } else if i.name.local_name == "text-underline-type" && i.value == "double" {
                is_double_underline = true;
            } else if i.name.local_name == "text-underline-color" {
                if i.value == "font-color" {
                    map.insert(
                        "textDecorationColor".to_string(),
                        Value::String("currentcolor".to_string()),
                    );
                } else {
                    // The other valid values are all in hex format
                    map.insert("textDecorationColor".to_string(), Value::String(i.value));
                }
            } else if i.name.local_name == "font-name" {
                map.insert("fontFamily".to_string(), Value::String(i.value));
            }
        }
    }
    if is_double_underline {
        // The ODT standard supports double underlines of any kind (solid, dotted, etc), while CSS
        // only supports double solid underlines, so prioritize the double over the line style?
        map.insert(
            "textDecorationStyle".to_string(),
            Value::String("double".to_string()),
        );
    }
    map
}
