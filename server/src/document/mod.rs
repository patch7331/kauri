pub mod meta;
pub mod node;
pub mod styles;
pub mod units;

use self::meta::Meta; //need to specify self here for some reason
use node::{KDFNode, Node};
use serde::{Deserialize, Serialize};
use styles::Styles;
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

    /// Converts the document to a JSON string (pretty print in debug mode)
    #[cfg(debug_assertions)]
    pub fn to_json(&self) -> serde_json::Result<String> {
        serde_json::to_string_pretty(self)
    }

    #[cfg(not(debug_assertions))]
    pub fn to_json(&self) -> serde_json::Result<String> {
        serde_json::to_string(self)
    }
}

// KDF from here

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KDFDocument {
    pub content: Vec<KDFNode>,
    pub styles: Styles,
    pub meta: Meta,
}
