use crate::document::Document;
use serde::ser::Serialize;
use serde_json::error::Error;
#[cfg(not(debug_assertions))]
use serde_json::ser::to_string;
#[cfg(debug_assertions)]
use serde_json::ser::to_string_pretty;
use std::fs::File;
use std::io::BufWriter;
use std::io::Write;
use std::path::Path;
use zip::write::{FileOptions, ZipWriter};

pub fn save(document: &Document, path: &Path) -> Result<(), String> {
    let file = File::create(path);
    let created_file;
    match file {
        Ok(file) => created_file = file,
        Err(e) => return Err(e.to_string()),
    }
    let created_file = BufWriter::new(created_file);
    let mut writer = ZipWriter::new(created_file);
    let mut res = store_in_archive(&mut writer, "content.json", to_json(&document.content));
    if res.is_err() {
        return res;
    }
    res = store_in_archive(&mut writer, "styles.json", to_json(&document.styles));
    if res.is_err() {
        return res;
    }
    res = store_in_archive(&mut writer, "meta.json", to_json(&document.meta));
    if res.is_err() {
        return res;
    }
    Ok(())
}

#[cfg(debug_assertions)]
fn to_json<T: Serialize>(value: &T) -> Result<String, Error> {
    to_string_pretty(value)
}

#[cfg(not(debug_assertions))]
fn to_json<T: Serialize>(value: &T) -> Result<String, Error> {
    to_string(value)
}

fn store_in_archive(
    writer: &mut ZipWriter<BufWriter<File>>,
    name: &str,
    data: Result<String, Error>,
) -> Result<(), String> {
    if let Err(e) = data {
        return Err(e.to_string());
    }
    if let Err(e) = writer.start_file(name, FileOptions::default()) {
        return Err(e.to_string());
    }
    if let Err(e) = writer.write_all(&data.unwrap().into_bytes()) {
        return Err(e.to_string());
    }
    Ok(())
}
