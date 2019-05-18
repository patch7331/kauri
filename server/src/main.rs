extern crate tiny_http;

mod parsers;

use parsers::odt::ODTParser;

fn main() {
    let addr = "127.0.0.1:3000";
    let server = tiny_http::Server::http(addr).unwrap();
    println!("Listening on http://{}", addr);

    loop {
        let request = match server.recv() {
            //server.recv() blocks until a request actually comes
            Ok(rq) => rq,
            Err(e) => {
                println!("error: {}", e);
                break;
            }
        };
        handle_request(request);
    }
}

/// Takes a request and responds accordingly
fn handle_request(mut request: tiny_http::Request) {
    match request.url() {
        "/load" => {
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
        _ => {
            let response = tiny_http::Response::empty(404);
            if let Err(e) = request.respond(response) {
                println!("error: {}", e);
                return;
            }
        }
    }
}
