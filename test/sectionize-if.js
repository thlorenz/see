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

