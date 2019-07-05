/// Takes a path to a file and returns a ZipArchive representation of it.
/// This will make sure that the file is actually a zip file but will fail
/// if the file does not exist
pub fn get_archive(filepath: &str) -> Result<zip::ZipArchive<std::fs::File>, String> {
    let file = std::fs::File::open(&std::path::Path::new(&filepath)).unwrap();
    let archive = zip::ZipArchive::new(file);
    if let Err(e) = archive {
        // Handle case where the file is not even a zip file
        return Result::Err(e.to_string());
    }
    let archive = archive.unwrap();
    Result::Ok(archive)
}
