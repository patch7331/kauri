extern crate futures;
extern crate hyper;
extern crate zip;

use futures::future;
use hyper::rt::{Future, Stream};
use hyper::service::service_fn;
use hyper::{Body, Method, Request, Response, Server, StatusCode};
use std::fs;
use std::io;

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

        _ => {
            *response.status_mut() = StatusCode::NOT_FOUND;
        }
    };

    Box::new(future::ok(response))
}

fn main() {
    file_read_testing();

    let addr = ([127, 0, 0, 1], 3000).into();

    let server = Server::bind(&addr)
        .serve(|| service_fn(handle_request))
        .map_err(|e| eprintln!("Server error: {}", e));

    println!("Listening on http://{}", addr);
    hyper::rt::run(server);
}

fn file_read_testing() {
    println!("File to read:");
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read input from stdin");
    read_odt(input.trim()); //trim to get rid of the newline at the end
}

fn read_odt(filename: &str) {
    let file = std::path::Path::new(&filename);
    if file.exists() {
        let file = fs::File::open(&file).unwrap();
        let mut archive = zip::ZipArchive::new(file).unwrap();
        let content_xml = archive.by_name("content.xml").unwrap();
        println!("{}", content_xml.size());
    } else {
        println!("{:?}", fs::metadata(file));
    }
}
