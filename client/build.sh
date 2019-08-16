#!/bin/sh

cd client
yarn install &&
yarn clean-check &&
yarn jest &&
yarn build
