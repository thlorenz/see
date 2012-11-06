'use strict';
/*jshint asi:true */

var test       =  require('tap').test
  , tutl       =  require('./tutl')
  , cardinal   =  require('cardinal')
  , sectionize =  require('../lib/sectionize')
  , rangify    =  require('../lib/rangify')

function sectionizeAndRangify(code) {
  var sectionized = sectionize(code)
  return rangify(sectionized)
}

test('\nsectionized nested functions without empty lines', function (t) {
var code = '' + function outside () {
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
    , [ 1, 12 ]
    , [ 2, 2 ]
    , [ 3, 8 ]
    , [ 4, 4 ]
    , [ 5, 7 ]
    , [ 5, 7 ]
    , [ 5, 7 ]
    , [ 3, 8 ]
    , [ 9, 11 ]
    , [ 9, 11 ]
    , [ 9, 11 ]
    , [ 1, 12 ]
  ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(sectionizeAndRangify(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})









test('\nsectionized nested functions without empty lines', function (t) {
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
    , [ 1, 13 ]
    , [ 2, 3 ]
    , [ 2, 3 ]
    , [ 4, 9 ]
    , [ 5, 5 ]
    , [ 6, 8 ]
    , [ 6, 8 ]
    , [ 6, 8 ]
    , [ 4, 9 ]
    , [ 10, 12 ]
    , [ 10, 12 ]
    , [ 10, 12 ]
    , [ 1, 13 ]
  ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(sectionizeAndRangify(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})
