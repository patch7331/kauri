use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
#[cfg_attr(debug_assertions, derive(Debug))]
pub enum Node {
    Text(Text),
    Element(Element),
}

#[derive(Serialize, Deserialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct Text {
    content: String,
}

impl Text {
    /// Constructs a new text node.
    ///
    ///  - `content`: Internal text content.
    pub fn new(content: String) -> Text {
        Text { content }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct Element {
    tag: String,
    pub attributes: HashMap<String, String>,
    pub styles: HashMap<String, String>,
    pub children: Vec<Node>,
}

impl Element {
    /// Constructs a new element
    ///
    /// - `tag`: Tag name.
    pub fn new(tag: String) -> Element {
        Element {
            tag,
            attributes: HashMap::new(),
            styles: HashMap::new(),
            children: Vec::new(),
        }
    }
}

// KDF from here (also uses the old Text node)

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum KDFNode {
    Text(Text),
    Heading(Heading),
    Paragraph(NodeCommon),
}

#[derive(Serialize, Deserialize)]
pub struct NodeCommon {
    class: String,
    pub styles: HashMap<String, String>,
    pub children: Vec<KDFNode>,
}

#[derive(Serialize, Deserialize)]
pub struct Heading {
    #[serde(flatten)]
    common: NodeCommon,
    level: u32,
}
