use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Meta {
    title: String,
    authors: Vec<String>,
    created_at: String,
    updated_at: String,
    edit_duration: String,
}
