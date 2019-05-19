pub mod node;
pub mod units;

use node::Node;
use serde::{Deserialize, Serialize};
use units::DistanceUnit;

#[derive(Serialize, Deserialize)]
pub struct PaperSize {
    height: i32,
    width: i32,
    unit: DistanceUnit,
}

impl PaperSize {
    /// Constructs a new paper size object
    ///
    /// - `height` Paper height.
    /// - `width` Paper width.
    /// - `unit` Measurement unit for the paper height and width.
    pub fn new(height: i32, width: i32, unit: DistanceUnit) -> PaperSize {
        PaperSize {
            height,
            width,
            unit,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Document {
    title: String,
    paper_size: PaperSize,
    pub children: Vec<Node>,
}

impl Document {
    /// Constructs a new document object
    ///
    /// - `title` Document title.
    /// - `paper_size` Document size.
    pub fn new(title: String, paper_size: PaperSize) -> Document {
        Document {
            title,
            paper_size,
            children: Vec::new(),
        }
    }

    /// Converts the document to a JSON string
    pub fn to_json(&self) -> serde_json::Result<String> {
        serde_json::to_string_pretty(self)
    }
}
