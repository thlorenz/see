var fs = require('fs')
  , util = require('util')
  , acorn = require('acorn')
  , js = fs.readFileSync('./sample-02.js', 'utf-8');

function inspect (s) {
  console.log(util.inspect(s, false, 30, true));
}


inspect(acorn.parse(js));

