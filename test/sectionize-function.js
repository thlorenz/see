'use strict';
/*jshint asi:true */

var test       =  require('tap').test
  , tutl       =  require('./tutl')
  , cardinal   =  require('cardinal')

test('\nnested functions', function (t) {
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
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

test('\nnested function expression', function (t) {
  var code = '' + 
function outside () {
  var out;
  var insideUno = function () {
    var uno;
  }
}
  , expected = [
      undefined
    , 'outside'
    , 'outside'
    , 'FunctionExpression'
    , 'FunctionExpression'
    , 'FunctionExpression'
    , 'outside'
  ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})
