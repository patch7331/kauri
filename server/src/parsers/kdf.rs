use super::util::get_archive;
use crate::document::meta::Meta;
use crate::document::node::ChildNode;
use crate::document::styles::Styles;
use crate::document::Document;
use serde_json::error::Error;
use serde_json::from_str;
use std::fs::File;
use std::io::BufReader;
use std::io::Read;
use zip::ZipArchive;

pub fn load(path: &str) -> Result<String, String> {
    let archive = get_archive(path);
    if let Err(e) = archive {
        return Err(e);
    }
    let mut archive = archive.unwrap();

    let content = get_file_str("content.json", &mut archive);
    if content.is_err() {
        return content;
    }
    let content: Result<Vec<ChildNode>, Error> = from_str(&content.unwrap());
    if let Err(e) = content {
        return Err(e.to_string());
    }
    let content = content.unwrap();

    let styles = get_file_str("styles.json", &mut archive);
    if styles.is_err() {
        return styles;
    }
    let styles: Result<Styles, Error> = from_str(&styles.unwrap());
    if let Err(e) = styles {
        return Err(e.to_string());
    }
    let styles = styles.unwrap();

    let meta = get_file_str("meta.json", &mut archive);
    if meta.is_err() {
        return meta;
    }
    let meta: Result<Meta, Error> = from_str(&meta.unwrap());
    if let Err(e) = meta {
        return Err(e.to_string());
    }
    let meta = meta.unwrap();

    let document = Document {
        content,
        styles,
        meta: Some(meta),
    };
    let document = document.to_json();
    if let Err(e) = document {
        Err(e.to_string())
    } else {
        Ok(document.unwrap())
    }
}

fn get_file_str(name: &str, archive: &mut ZipArchive<File>) -> Result<String, String> {
    let data = archive.by_name(name);
    if let Err(e) = data {
        return Err(e.to_string());
    }
    let mut buffer: Vec<u8> = Vec::new();
    if let Err(e) = BufReader::new(data.unwrap()).read_to_end(&mut buffer) {
        return Err(e.to_string());
    }
    let data = String::from_utf8(buffer);
    if let Err(e) = data {
        return Err(e.to_string());
    }
    Ok(data.unwrap())
}
