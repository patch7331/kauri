use std::io::Cursor;
use tiny_http::{Request, Response};

/// Create a response with the given message as the body, and if is_error is true
/// then the HTTP status code is set to 400, otherwise it will be 200
/// (Note that if there was an unexpected error where this function was never called
/// then tiny_http will return 500 instead)
pub fn create_response(msg: String, is_error: bool) -> Response<Cursor<Vec<u8>>> {
    let mut response = Response::from_string(msg);
    if is_error {
        response = response.with_status_code(400);
    }
    response
}

/// Returns the body of a given request
pub fn get_request_body(request: &mut Request) -> Result<String, String> {
    let req_reader = request.as_reader();
    let mut body_bytes: Vec<u8> = Vec::new();
    if let Err(e) = req_reader.read_to_end(&mut body_bytes) {
        return Err(e.to_string());
    }
    let body_str = String::from_utf8(body_bytes);
    if let Err(e) = body_str {
        Err(e.to_string())
    } else {
        Ok(body_str.unwrap())
    }
}
