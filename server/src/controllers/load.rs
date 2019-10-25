use super::util::{create_response, get_request_body};
use crate::parsers::kdf;
use crate::parsers::odt::ODTParser;
use std::io::Cursor;
use tiny_http::{Request, Response};

/// Handles a request for loading a file
pub fn load_controller(request: &mut Request) -> Response<Cursor<Vec<u8>>> {
    let filepath = get_request_body(request);
    if let Err(e) = filepath {
        return create_response(e, true);
    }

    let filepath = filepath.unwrap();
    let file = std::path::Path::new(&filepath);
    if !file.exists() {
        return create_response(format!("{:?}", std::fs::metadata(file)), true);
    }

    let extension = filepath.split('.').last();
    match extension {
        // Pick a parser depending on the file extension
        Some("odt") => handle_odt(filepath.as_str()),
        Some("kdf") => handle_kdf(filepath.as_str()),
        _ => create_response("File extension missing or unrecognized".to_string(), true),
    }
}

/// Handles a request for loading an ODT
fn handle_odt(filepath: &str) -> Response<Cursor<Vec<u8>>> {
    let mut parser = ODTParser::new();
    let parsed_odt = parser.parse(filepath);
    if let Err(e) = parsed_odt {
        return create_response(e.to_string(), true);
    }
    create_response(parsed_odt.unwrap(), false)
}

fn handle_kdf(filepath: &str) -> Response<Cursor<Vec<u8>>> {
    let output = kdf::load(filepath);
    if let Err(e) = output {
        return create_response(e, true);
    }
    create_response(output.unwrap(), false)
}
