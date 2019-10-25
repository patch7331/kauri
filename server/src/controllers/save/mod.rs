mod transport;

use super::util::{create_response, get_request_body};
use crate::savers::kdf;
use serde_json::{from_str, Error};
use std::io::Cursor;
use std::path::Path;
use tiny_http::{Request, Response};
use transport::SaveTransport;

/// Handles a request for saving a file
pub fn save_controller(request: &mut Request) -> Response<Cursor<Vec<u8>>> {
    let body = get_request_body(request);
    if let Err(e) = body {
        return create_response(e, true);
    }

    let body = body.unwrap();
    let data: Result<SaveTransport, Error> = from_str(&body);
    if let Err(e) = data {
        return create_response(e.to_string(), true);
    }

    let data = data.unwrap();
    let path = Path::new(&data.path);

    let extension = data.path.split('.').last();
    match extension {
        Some("kdf") => {
            if let Err(e) = kdf::save(&data.document, &path) {
                create_response(e, true)
            } else {
                create_response("".to_string(), false)
            }
        }
        _ => create_response("File extension missing or unrecognised".to_string(), true),
    }
}
