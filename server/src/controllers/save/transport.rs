use crate::document::Document;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct SaveTransport {
    pub path: String,
    pub document: Document,
}
