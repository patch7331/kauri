use tiny_http::Request;
use tiny_http::Response;

pub fn respond(request: Request, msg: String, is_error: bool) {
    let mut response = Response::from_string(msg);
    if is_error {
        response = response.with_status_code(500);
    }
    if let Err(e) = request.respond(response) {
        println!("error: {}", e);
        return;
    }
}
