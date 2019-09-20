use tiny_http::Response;
use std::io::Cursor;

pub fn create_response(msg: String, is_error: bool) -> Response<Cursor<Vec<u8>>> {
    let mut response = Response::from_string(msg);
    if is_error {
        response = response.with_status_code(500);
    }
    response
}
