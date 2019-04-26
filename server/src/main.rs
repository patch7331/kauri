extern crate futures;
extern crate hyper;
extern crate serde_json;
extern crate xml;
extern crate zip;

use futures::future;
use hyper::rt::{Future, Stream};
use hyper::service::service_fn;
use hyper::{Body, Method, Request, Response, Server, StatusCode};
use serde_json::map::Map;
use serde_json::value::Value;
use serde_json::Number;
use std::fs;
use std::io;
use xml::reader::{EventReader, XmlEvent};

type BoxFuture = Box<Future<Item = Response<Body>, Error = hyper::Error> + Send>;

/// This is our service handler. It receives a `Request` and routes it
/// according to its path.
fn handle_request(req: Request<Body>) -> BoxFuture {
    let mut response = Response::new(Body::empty());

    match (req.method(), req.uri().path()) {
        (&Method::POST, "/key") => {
            // *response.body_mut() = req.into_body();
            // req.into_body().then(|result| {
            //     match result {
            //         Ok(e) => println!("{:?}", e),
            //         Err(e) => println!("Error: {}", e)
            //     }
            // });
            let mapping = req.into_body().map(|chunk| {
                chunk
                    .iter()
                    .map(|byte| {
                        println!("{}", *byte as char);
                        byte.to_ascii_uppercase()
                    })
                    .collect::<Vec<u8>>()
            });

            *response.body_mut() = Body::wrap_stream(mapping);
        }
		(&Method::POST, "/load") => {
            *response.body_mut() = Body::from(file_read_testing());
        }
        _ => {
            *response.status_mut() = StatusCode::NOT_FOUND;
        }
    };

    Box::new(future::ok(response))
}

fn main() {
    let addr = ([127, 0, 0, 1], 3000).into();

    let server = Server::bind(&addr)
        .serve(|| service_fn(handle_request))
        .map_err(|e| eprintln!("Server error: {}", e));

    println!("Listening on http://{}", addr);
    hyper::rt::run(server);
}

fn file_read_testing() -> String {
    println!("File to read:");
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read input from stdin");
    read_odt(input.trim())
}

fn read_odt(filename: &str) -> String {
    let file = std::path::Path::new(&filename);
    if !file.exists() {
        //make sure the file actually exists
        println!("{:?}", fs::metadata(file));
        return serde_json::to_string(&Value::Null).unwrap()
    }

    let file = fs::File::open(&file).unwrap();
    let mut archive = zip::ZipArchive::new(file).unwrap();
    let content_xml = archive.by_name("content.xml").unwrap(); //returns a ZipFile struct which implements Read
    let content_xml = io::BufReader::new(content_xml);

    let parser = EventReader::new(content_xml);
    let mut begin = false; //used to ignore all the other tags before office:body for now
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
                        begin = true;
                    } else if begin {
                        if prefix == "text" && name.local_name == "h" {
                            //heading
                            let mut level = 0.0; //because JS numbers are always floats apparently
                            for i in attributes {
                                //attributes is a Vec, so need to search for the level
                                if i.name.prefix.unwrap() == "text"
                                    && i.name.local_name == "outline-level"
                                {
                                    level = i.value.parse::<f64>().unwrap();
                                }
                            }
                            let mut map: Map<String, Value> = Map::new();
                            map.insert("type".to_string(), Value::String("heading".to_string()));
                            map.insert(
                                "level".to_string(),
                                Value::Number(Number::from_f64(level).unwrap()),
                            );
                            map.insert("children".to_string(), Value::Array(Vec::new()));
                            current_value = Value::Object(map);
                        } else if prefix == "text" && name.local_name == "p" {
                            let mut map: Map<String, Value> = Map::new();
                            map.insert("type".to_string(), Value::String("paragraph".to_string()));
                            map.insert("children".to_string(), Value::Array(Vec::new()));
                            current_value = Value::Object(map);
                        }
                    }
                }
            }
            Ok(XmlEvent::Characters(contents)) => {
                //the contents of a tag
                let mut map: Map<String, Value> = Map::new();
                map.insert("type".to_string(), Value::String("text".to_string()));
                map.insert("content".to_string(), Value::String(contents));
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
                if begin {
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
                }
            }
            Err(e) => {
                println!("Error: {}", e);
                return serde_json::to_string(&Value::Null).unwrap()
            }
            _ => {}
        }
    }

    let mut document_object: Map<String, Value> = Map::new();
    document_object.insert("document".to_string(), document_hierarchy.pop().unwrap());
    let document_object = Value::Object(document_object);
    serde_json::to_string_pretty(&document_object).unwrap()
}
