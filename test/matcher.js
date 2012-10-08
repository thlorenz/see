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
      t.deepEquals(data.lines[0].lineno, 2, 'lineno of first occurrence')
      t.deepEquals(data.lines[0].column, 6, 'column of first occurrence')

      t.deepEquals(data.lines[1].lineno, 4, 'lineno of second occurrence')
      t.deepEquals(data.lines[1].column, 9, 'column of second occurrence')
      t.end();
      
    }) 
    .write({ fullPath: foofunction });

})
