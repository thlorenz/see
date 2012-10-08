'use strict';
/*jshint asi:true */
var test = require('tap').test
  , path = require('path')
  , grejs = require('..')
  ;

function opts (extend) {
  var o = { root: path.join(__dirname, 'fixtures') };

  if (extend) {
    for (var prop in extend) {
      o[prop] = extend[prop];
    }
  }
  return o;
}

test('filtering foo-function.js', function (t) {
  grejs(opts({ fileFilter: 'foo-function.js', term: 'bar' }));  
  t.end();
})
