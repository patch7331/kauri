#!/bin/sh

cd server
cargo fmt --all -- --check &&
cargo clippy &&
cargo build --verbose &&
cargo test --verbose
