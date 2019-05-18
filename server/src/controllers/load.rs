use super::util::respond;
use crate::parsers::odt::ODTParser;
use tiny_http::Request;

/// Handles a request for loading a file
pub fn load_controller(mut request: Request) {
    let req_reader = request.as_reader();
    let mut body_bytes: Vec<u8> = Vec::new();
    if let Err(e) = req_reader.read_to_end(&mut body_bytes) {
        respond(request, e.to_string(), true);
        return;
    }

    let body_str = std::str::from_utf8(&body_bytes);
    if let Err(e) = body_str {
        respond(request, e.to_string(), true);
        return;
    }

    let filepath = body_str.unwrap();
    let file = std::path::Path::new(&filepath);
    if !file.exists() {
        respond(request, format!("{:?}", std::fs::metadata(file)), true);
        return;
    }

    let extension = filepath.split('.').last();
    match extension {
        //pick a parser depending on the file extension
        Some(".odt") => handle_odt(request, filepath),
        _ => respond(
            request,
            "File extension missing or unrecognized".to_string(),
            true,
        ),
    }
}

/// Handles a request for loading an ODT
fn handle_odt(request: Request, filepath: &str) {
    let parser = ODTParser::new(filepath);
    if let Err(e) = parser {
        respond(request, e.to_string(), true);
        return;
    }

    let parsed_odt = parser.unwrap().parse();
    if let Err(e) = parsed_odt {
        respond(request, e.to_string(), true);
        return;
    }
    respond(request, parsed_odt.unwrap(), false);
}
