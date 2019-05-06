extern crate serde_json;
extern crate tiny_http;
extern crate xml;
extern crate zip;

use serde_json::map::Map;
use serde_json::value::Value;
use serde_json::Number;
use std::fs;
use std::io;
use xml::reader::{EventReader, XmlEvent};

fn main() {
    let addr = "127.0.0.1:3000";
    let server = tiny_http::Server::http(addr).unwrap();
    println!("Listening on http://{}", addr);

    loop {
        let mut request = match server.recv() {
            //server.recv() blocks until a request actually comes
            Ok(rq) => rq,
            Err(e) => {
                println!("error: {}", e);
                break;
            }
        };
        match request.url() {
            //check the URL and respond accordingly
            "/load" => {
                let req_reader = request.as_reader();
                let mut body_bytes: Vec<u8> = Vec::new();
                if let Err(e) = req_reader.read_to_end(&mut body_bytes) {
                    println!("error: {}", e);
                    continue;
                }
                let body_str = std::str::from_utf8(&body_bytes);
                if let Err(e) = body_str {
                    println!("error: {}", e);
                    continue;
                }
                let response = tiny_http::Response::from_string(read_odt(body_str.unwrap()));
                if let Err(e) = request.respond(response) {
                    println!("error: {}", e);
                    continue;
                }
            }
            _ => {
                let response = tiny_http::Response::empty(404);
                if let Err(e) = request.respond(response) {
                    println!("error: {}", e);
                    continue;
                }
            }
        }
    }
}

/// Reads an ODT file referred to by the given path
/// and returns a JSON string containing a DOM
fn read_odt(filepath: &str) -> String {
    let file = std::path::Path::new(&filepath);
    if !file.exists() {
        //make sure the file actually exists
        println!("{:?}", fs::metadata(file));
        return serde_json::to_string(&Value::Null).unwrap();
    }

    let file = fs::File::open(&file).unwrap();
    let archive = zip::ZipArchive::new(file);
    if let Err(e) = archive {
        //handle case where the file is not even a zip file
        println!("{}", e);
        return serde_json::to_string(&Value::Null).unwrap();
    }
    let mut archive = archive.unwrap();
    let content_xml = archive.by_name("content.xml"); //returns a ZipFile struct which implements Read if the file is in the archive
    if let Err(e) = content_xml {
        //handle case where there is no content.xml (so probably not actually an ODT file)
        println!("{}", e);
        return serde_json::to_string(&Value::Null).unwrap();
    }
    let content_xml = io::BufReader::new(content_xml.unwrap());

    let parser = EventReader::new(content_xml);
    let mut body_begin = false;
    let mut styles_begin = false;

    let mut auto_styles: Map<String, Value> = Map::new(); //map of automatic style names in the ODT to its contents in JSON form (automatic meaning the user did not explicitly name it)
    let mut current_style_value = Value::Null;
    let mut current_style_name = String::new();

    let mut is_span = false;
    let mut current_span_style = String::new();

    let mut document_contents: Map<String, Value> = Map::new(); //value of the "document" key
    document_contents.insert(
        "title".to_string(),
        Value::String("Kauri (Working title)".to_string()),
    );
    document_contents.insert("paper".to_string(), Value::String("A4".to_string()));
    document_contents.insert("children".to_string(), Value::Array(Vec::new()));
    let mut document_hierarchy: Vec<Value> = Vec::new(); //in case of nested tags, not actually handled yet
    let mut current_value = Value::Null;
    document_hierarchy.push(Value::Object(document_contents));

    for e in parser {
        //iterate through the XML
        match e {
            Ok(XmlEvent::StartElement {
                name, attributes, ..
            }) => {
                if let Some(prefix) = name.prefix {
                    if prefix == "office" && name.local_name == "body" {
                        body_begin = true;
                    } else if body_begin {
                        if prefix == "text" && name.local_name == "h" {
                            let (mut map, style_name) = heading_begin(attributes);
                            map.insert(
                                "style".to_string(),
                                auto_styles.get(&style_name).unwrap().clone(),
                            );
                            current_value = Value::Object(map);
                        } else if prefix == "text" && name.local_name == "p" {
                            let (mut map, style_name) = paragraph_begin(attributes);
                            map.insert(
                                "style".to_string(),
                                auto_styles.get(&style_name).unwrap().clone(),
                            );
                            current_value = Value::Object(map);
                        } else if prefix == "text" && name.local_name == "span" {
                            is_span = true;
                            current_span_style = span_begin(attributes);
                        }
                    } else if prefix == "office" && name.local_name == "automatic-styles" {
                        styles_begin = true;
                    } else if styles_begin {
                        if prefix == "style" && name.local_name == "style" {
                            current_style_name = style_begin(attributes);
                        } else if prefix == "style" && name.local_name == "text-properties" {
                            current_style_value = Value::Object(text_properties_begin(attributes));
                        }
                    }
                }
            }
            Ok(XmlEvent::Characters(contents)) => {
                //currently the only type of tag expected to emit this event is the ones in the body,
                //in which case they will contain the document text
                let mut map: Map<String, Value> = Map::new();
                map.insert("type".to_string(), Value::String("text".to_string()));
                map.insert("content".to_string(), Value::String(contents));
                if is_span {
                    map.insert(
                        "style".to_string(),
                        auto_styles.get(&current_span_style).unwrap().clone(),
                    );
                    current_span_style = String::new();
                    is_span = false;
                }
                current_value
                    .as_object_mut()
                    .unwrap()
                    .get_mut("children")
                    .unwrap()
                    .as_array_mut()
                    .unwrap()
                    .push(Value::Object(map));
            }
            Ok(XmlEvent::EndElement { name }) => {
                if body_begin {
                    if let Some(prefix) = name.prefix {
                        if prefix == "office" && name.local_name == "body" {
                            break;
                        } else if prefix == "text"
                            && (name.local_name == "h" || name.local_name == "p")
                        {
                            document_hierarchy
                                .last_mut()
                                .unwrap()
                                .as_object_mut()
                                .unwrap()
                                .get_mut("children")
                                .unwrap()
                                .as_array_mut()
                                .unwrap()
                                .push(current_value);
                            current_value = Value::Null;
                        }
                    }
                } else if styles_begin {
                    if let Some(prefix) = name.prefix {
                        if prefix == "office" && name.local_name == "automatic-styles" {
                            styles_begin = false;
                        } else if prefix == "style" && name.local_name == "style" {
                            auto_styles.insert(current_style_name, current_style_value);
                            current_style_name = String::from("");
                            current_style_value = Value::Null;
                        }
                    }
                }
            }
            Err(e) => {
                println!("Error: {}", e);
                return serde_json::to_string(&Value::Null).unwrap();
            }
            _ => {}
        }
    }

    let mut document_object: Map<String, Value> = Map::new();
    document_object.insert("document".to_string(), document_hierarchy.pop().unwrap());
    let document_object = Value::Object(document_object);
    serde_json::to_string(&document_object).unwrap()
}

/// Takes the set of attributes of a text:h tag in the ODT's content.xml,
/// and returns a map for use in a Value::Object enum that represents a heading element based on the attributes,
/// together with the value of the text:style-name attribute of the tag
fn heading_begin(attributes: Vec<xml::attribute::OwnedAttribute>) -> (Map<String, Value>, String) {
    let mut level = 0.0; //because JS numbers are always floats apparently
    let mut style_name = String::new();
    for i in attributes {
        let prefix = i.name.prefix.unwrap();
        if prefix == "text" && i.name.local_name == "outline-level" {
            level = i.value.parse::<f64>().unwrap();
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
        if i.name.prefix.unwrap() == "text" && i.name.local_name == "style-name" {
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
        if i.name.prefix.unwrap() == "text" && i.name.local_name == "style-name" {
            style_name = i.value;
        }
    }
    style_name
}

/// Takes the set of attributes of a style:style tag in the ODT's content.xml,
/// and returns the name of the style
fn style_begin(attributes: Vec<xml::attribute::OwnedAttribute>) -> String {
    for i in attributes {
        if i.name.prefix.unwrap() == "style" && i.name.local_name == "name" {
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
        let prefix = i.name.prefix.unwrap();
        if prefix == "fo" {
            if i.name.local_name == "font-weight" {
                map.insert("fontWeight".to_string(), Value::String(i.value)); //all valid values for this attribute is also valid in the CSS equivalent, so just use it as is
            } else if i.name.local_name == "font-style" && i.value != "backslant" {
                //backslant is not valid in CSS, but all the other ones are
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
                        //there are a few possible styles in ODF that aren't present in CSS (dot-dash, dot-dot-dash, long-dash), so just put in a basic underline?
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
                    //the other valid values are all in hex format
                    map.insert("textDecorationColor".to_string(), Value::String(i.value));
                }
            } else if i.name.local_name == "font-name" {
                map.insert("fontFamily".to_string(), Value::String(i.value));
            }
        }
    }
    if is_double_underline {
        //the ODF standard supports double underlines of any kind (solid, dotted, etc), while CSS only supports double solid underlines,
        //so prioritize the double over the line style?
        map.insert(
            "textDecorationStyle".to_string(),
            Value::String("double".to_string()),
        );
    }
    map
}
