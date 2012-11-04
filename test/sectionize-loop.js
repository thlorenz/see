'use strict';
/*jshint asi:true */

var test       =  require('tap').test
  , tutl       =  require('./tutl')
  , cardinal   =  require('cardinal')

test('\nfor loop', function (t) {
  var code = '' +
function outer () {
  for (var i = 0; i < 2; i++) {
    console.log(i);
  }
}
  , expected = [
      undefined
    , 'outer'
    , 'ForStatement'
    , 'ForStatement'
    , 'ForStatement'
    , 'outer'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\nfor in loop', function (t) {
  var code = '' +
function outer () {
  for (var key in process) {
    console.log(key);
  }
}
  , expected = [
      undefined
    , 'outer'
    , 'ForInStatement'
    , 'ForInStatement'
    , 'ForInStatement'
    , 'outer'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\nwhile loop', function (t) {
  var code = '' +
function outer () {
  while (true) {
    console.log('blocking like Java');
  }
}
  , expected = [
      undefined
    , 'outer'
    , 'WhileStatement'
    , 'WhileStatement'
    , 'WhileStatement'
    , 'outer'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\ndo while loop', function (t) {
  var code = '' +
function outer () {
  do {
    console.log('blocking like Java');
  } while (true) 
}
  , expected = [
      undefined
    , 'outer'
    , 'DoWhileStatement'
    , 'DoWhileStatement'
    , 'DoWhileStatement'
    , 'outer'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

