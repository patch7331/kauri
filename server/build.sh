#!/bin/sh

cd server
cargo fmt --all -- --check &&
cargo clippy -- -D warnings &&
cargo build --verbose &&
cargo test --verbose
