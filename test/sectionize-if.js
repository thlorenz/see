'use strict';
/*jshint asi:true */

var test       =  require('tap').test
  , tutl       =  require('./tutl')
  , cardinal   =  require('cardinal')

test('\nif statement', function (t) {
  var code = '' +

function outer () {
  if (true) {
    console.log('true');
  }
}
  , expected = [
      undefined
    , '1:5'
    , '2:4'
    , '2:4'
    , '2:4'
    , '1:5'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndLocate(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\nif else statement', function (t) {
  var code = '' +
function outer () {
  if (true) {
    console.log('true');
  } else {
    return false;
  }
}
, expected = [
      undefined
    , '1:7'
    , '2:6'
    , '2:6'
    , '2:6'
    , '2:6'
    , '2:6'
    , '1:7'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndLocate(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\nif statement without braces', function (t) {
  var code = '' +
function outer () {
  if (true) 
    console.log('true');
}
  , expected = [
      undefined
    , '1:4'
    , '2:3'
    , '2:3'
    , '1:4'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndLocate(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\nif else statement without braces', function (t) {
  var code = '' +
function outer () {
  if (true) 
    console.log('true');
  else 
    return false;
}
  , expected = [
      undefined
    , '1:6'
    , '2:5'
    , '2:5'
    , '2:5'
    , '2:5'
    , '1:6'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndLocate(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})
