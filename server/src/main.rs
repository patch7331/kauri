extern crate tiny_http;

mod parsers;
mod controllers;

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
        "/load" => controllers::load::load_controller(request),
        _ => {
            let response = tiny_http::Response::empty(404);
            if let Err(e) = request.respond(response) {
                println!("error: {}", e);
                return;
            }
        }
    }
}
