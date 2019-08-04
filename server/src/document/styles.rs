use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
pub struct Styles {
    page: PageStyle,
    pub classes: HashMap<String, Style>,
}

#[derive(Serialize, Deserialize)]
pub struct PageStyle {
    size: String, //use enum or leave as string?
    height: String,
    width: String,
    orientation: Orientation,
    margin_top: String, //there will be more here (borders, background), list all explicitly or use a flattened HashMap instead?
    margin_bottom: String,
    margin_left: String,
    margin_right: String,
}

#[derive(Serialize, Deserialize)]
pub enum Orientation {
    Portrait,
    Landscape,
}

#[derive(Serialize, Deserialize)]
pub struct Style {
    display: String,
    inherit: Option<String>,
    pub styles: HashMap<String, String>,
}

impl Style {
    /// Constructs a new Style for use in named styles
    pub fn new(display: String, inherit: Option<String>) -> Style {
        Style {
            display,
            inherit,
            styles: HashMap::new(),
        }
    }
}
