use crate::document::Document;
use serde_json::error::Error;
use serde_json::ser::to_string;
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
    let mut res = store_in_archive(&mut writer, "content.json", to_string(&document.content));
    if res.is_err() {
        return res;
    }
    res = store_in_archive(&mut writer, "styles.json", to_string(&document.styles));
    if res.is_err() {
        return res;
    }
    res = store_in_archive(&mut writer, "meta.json", to_string(&document.meta));
    if res.is_err() {
        return res;
    }
    Ok(())
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
