'use strict';
/*jshint asi:true */

var test       =  require('tap').test
  , inspect    =  require('../lib/utl').inspect
  , tutl       =  require('./tutl')
  , sectionize =  require('../lib/sectionize')
  , cardinal   =  require('cardinal')

/* TODO: decide if we want to handle non braced if/for/while etc., statements and if yes fix these tests
 *
 *test('\nsectionizing if statement without braces', function (t) {
 *  var code = '' +
 *function outer () {
 *  if (true) 
 *    console.log('true');
 *}
 *  , expected = [
 *      undefined
 *    , '1:4'
 *    , '2:3'
 *    , '2:3'
 *    , '1:4'
 *    ]
 *
 *  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
 *    var lines = sectionizeAndLocate(code)
 *    t.deepEquals(lines, expected, tutl.linenos(expected))
 *    t.end()
 *  })
 *  t.end()
 *})
 *
 *test('\nsectionizing if else statement without braces', function (t) {
 *  var code = '' +
 *function outer () {
 *  if (true) 
 *    console.log('true');
 *  else 
 *    return false;
 *}
 *  , expected = [
 *      undefined
 *    , '1:6'
 *    , '2:5'
 *    , '2:5'
 *    , '2:5'
 *    , '2:5'
 *    , '1:6'
 *    ]
 *
 *  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
 *    t.deepEquals(sectionizeAndLocate(code), expected, tutl.linenos(expected))
 *    t.end()
 *  })
 *  t.end()
 *})
 */
