use tiny_http::Request;
use crate::parsers::odt::ODTParser;

pub fn load_controller(mut request: Request) {
	let req_reader = request.as_reader();
    let mut body_bytes: Vec<u8> = Vec::new();
    if let Err(e) = req_reader.read_to_end(&mut body_bytes) {
        println!("error: {}", e);
        return;
    }
    let body_str = std::str::from_utf8(&body_bytes);
    if let Err(e) = body_str {
        println!("error: {}", e);
        return;
    }
    let parser = ODTParser::new(body_str.unwrap());
    if let Err(e) = parser {
        println!("error: {}", e);
        return;
    }
    let parsed_odt = parser.unwrap().parse();
    if let Err(e) = parsed_odt {
        println!("error: {}", e);
        return;
    }
    let response = tiny_http::Response::from_string(parsed_odt.unwrap());
    if let Err(e) = request.respond(response) {
        println!("error: {}", e);
        return;
    }
}