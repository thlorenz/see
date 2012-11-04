'use strict';
/*jshint asi:true */

var test = require('tap').test
  , tutl       =  require('./tutl')
  , sectionize = require('../lib/sectionize')
  , cardinal = require('cardinal')

function nameParent (statement) { 
    if (!statement) return undefined;
    var parent = statement.parent;

    if (parent.id) return parent.id.name;
    if (parent.type) return parent.type;

    return undefined;
}

function sectionizeAndNameParent(code) {
  return sectionize(code).map(nameParent);
}

test('\nsectionizing nested functions', function (t) {
  var code = '' + 
function outside () {
  var out;

  function insideUno () {
    var uno;
    function nestedInsideUno () {
      var nest;
    }
  }

  function insideDos () {
    var dos;
  }
}
  , expected = [
      undefined
    , 'outside'
    , 'outside'
    , 'outside'
    , 'insideUno'
    , 'insideUno'
    , 'nestedInsideUno'
    , 'nestedInsideUno'
    , 'nestedInsideUno'
    , 'insideUno'
    , 'outside'
    , 'insideDos'
    , 'insideDos'
    , 'insideDos'
    , 'outside'
  ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\nsectionizing if statement', function (t) {
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
    t.deepEquals(sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})


test('\nsectionizing if else statement', function (t) {
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
    t.deepEquals(sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

