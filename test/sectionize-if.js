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
    , 'outer'
    , 'IfStatement'
    , 'IfStatement'
    , 'IfStatement'
    , 'outer'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
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
    , 'outer'
    , 'IfStatement'
    , 'IfStatement'
    , 'IfStatement'
    , 'IfStatement'
    , 'IfStatement'
    , 'outer'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\nsectionizing if statement without braces', function (t) {
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

test('\nsectionizing if else statement without braces', function (t) {
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
