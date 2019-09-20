//! Kauri daemon
//!
//! The following module contains the Kauri daemon. A simple HTTP server that
//! runs silently in the background, providing performance critical services to
//! the Electron front end. This portion of the project most notable includes
//! the following modules:
//!
//! - A basic `document` implementation.
//! - Parsers for common document formats (`parsers`).
//! - Exporters for common file formats.

#![warn(missing_docs)]

extern crate tiny_http;

mod controllers;
mod document;
mod parsers;

use tiny_http::{Header, Response};

/// Main entry point
/// Establishes the simple HTTP server, and listens for requests.
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
fn handle_request(request: tiny_http::Request) {
    let resp: Response<std::io::Read> = match request.url() {
        "/load" => controllers::load::load_controller(request),
        _ => Response::empty(404),
    };

    resp.add_header(Header::from_str("Access-Control-Allow-Origin: *"));

    if let Err(e) = request.respond(resp) {
        println!("error: {}", e);
        return;
    }
}
