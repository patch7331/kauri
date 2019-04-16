extern crate futures;
extern crate hyper;

use futures::future;
use hyper::rt::{Future, Stream};
use hyper::service::service_fn;
use hyper::{Body, Method, Request, Response, Server, StatusCode};

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
    let addr = ([127, 0, 0, 1], 3000).into();

    let server = Server::bind(&addr)
        .serve(|| service_fn(handle_request))
        .map_err(|e| eprintln!("Server error: {}", e));

    println!("Listening on http://{}", addr);
    hyper::rt::run(server);
}
