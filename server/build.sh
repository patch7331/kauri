#!/bin/sh

cd server
cargo fmt --all -- --check &&
cargo build --verbose &&
cargo test --verbose
