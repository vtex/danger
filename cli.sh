#!/bin/bash

$(pwd)/node_modules/.bin/danger $1 -d ./action/dangerfile.js "${@:2}"