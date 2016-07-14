#!/usr/bin/env node

var fs = require('fs');
var wrangel = require('./src/index.js');

var inputs = process.argv.slice(2).map(n => JSON.parse(fs.readFileSync(n)));
process.stdout.write(JSON.stringify(wrangel(inputs), null, 2));