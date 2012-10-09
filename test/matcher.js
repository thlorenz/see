'use strict';

/*jshint asi:true */

var test = require('tap').test
  , tap  = require('tap-stream')
  , path = require('path')
  , readContentAndFindMatchingLines = require('../lib/matcher')
  , root = path.join(__dirname, 'fixtures') 
  , foofunction = path.join(root, 'foo-function.js')
  ;

test('matching foo-function.js for bar', function (t) {
  readContentAndFindMatchingLines('bar') 
    .on('data', function (data) {
      t.deepEquals(data.matches[0].lineno, 2, 'lineno of first match')
      t.deepEquals(data.matches[0].column, 6, 'column of first match')

      t.deepEquals(data.matches[1].lineno, 4, 'lineno of second match')
      t.deepEquals(data.matches[1].column, 9, 'column of second match')

      t.equals(data.lines.length, 5, 'lines contain all lines in file')
      t.equals(data.lines[0], 'function foo () {', 'text of first line')

      t.end();
    }) 
    .write({ fullPath: foofunction })
})
