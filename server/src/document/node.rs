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

#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
#[cfg_attr(debug_assertions, derive(Debug))]
pub enum KDFNode {
    Text(Text),
    Heading(Heading),
    Paragraph(NodeCommon),
    Span(NodeCommon),
    List(List),
    ListItem(ListItem),
    Caption(NodeCommon),
    Hyperlink(Hyperlink),
}

#[derive(Serialize, Deserialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct NodeCommon {
    #[serde(skip_serializing_if = "Option::is_none")]
    class: Option<String>,
    #[serde(skip_serializing_if = "HashMap::is_empty")]
    pub styles: HashMap<String, String>,
    pub children: Vec<KDFNode>,
}

impl NodeCommon {
    /// Constructs a new NodeCommon struct
    ///
    /// - `class` Style class of the element.
    pub fn new(class: Option<String>) -> NodeCommon {
        NodeCommon {
            class,
            styles: HashMap::new(),
            children: Vec::new(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct Heading {
    #[serde(flatten)]
    pub common: NodeCommon,
    level: u32,
}

impl Heading {
    /// Constructs a new Heading element
    ///
    /// - `class` Style class of the element.
    /// - `level` Level of the heading.
    pub fn new(class: Option<String>, level: u32) -> Heading {
        Heading {
            common: NodeCommon::new(class),
            level,
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct List {
    #[serde(flatten)]
    pub common: NodeCommon,
    ordered: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    prefix: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    suffix: Option<String>,
    #[serde(flatten)]
    bullet: ListBullet,
}

impl List {
    /// Constructs a new List element
    ///
    /// - `class` Style class of the element.
    /// - `ordered` Indicates if this is an ordered list.
    /// - `prefix` Prefix for the list bullet.
    /// - `suffix` Suffix for the list bullet.
    /// - `bullet` Type of the list bullet.
    pub fn new(
        class: Option<String>,
        ordered: bool,
        prefix: Option<String>,
        suffix: Option<String>,
        bullet: ListBullet,
    ) -> List {
        List {
            common: NodeCommon::new(class),
            ordered,
            prefix,
            suffix,
            bullet,
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub enum ListBullet {
    Variant(String),
    String(String),
    Image(String),
}

#[derive(Serialize, Deserialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct ListItem {
    #[serde(flatten)]
    pub common: NodeCommon,
    #[serde(flatten)]
    bullet: ListBullet,
}

impl ListItem {
    /// Constructs a new ListItem element
    ///
    /// - `class` Style class of the element.
    /// - `bullet` Type of the list bullet.
    pub fn new(class: Option<String>, bullet: ListBullet) -> ListItem {
        ListItem {
            common: NodeCommon::new(class),
            bullet,
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[cfg_attr(debug_assertions, derive(Debug))]
pub struct Hyperlink {
    #[serde(flatten)]
    pub common: NodeCommon,
    href: String,
}

impl Hyperlink {
    /// Constructs a new Hyperlink element
    ///
    /// - `class` Style class of the element.
    /// - `href` Hyperlink reference.
    pub fn new(class: Option<String>, href: String) -> Hyperlink {
        Hyperlink {
            common: NodeCommon::new(class),
            href,
        }
    }
}
