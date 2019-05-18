use super::util::respond;
use crate::parsers::odt::ODTParser;
use tiny_http::Request;

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
    let parser = ODTParser::new(body_str.unwrap());
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
