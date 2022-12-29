#!/bin/bash

args="--config=../../.eslintrc.cjs --ignore-path=../../.eslintignore --ext .js,.ts . $@"
echo "eslint $args"
../../node_modules/.bin/eslint $args
