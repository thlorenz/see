'use strict';
/*jshint asi:true */

var test       =  require('tap').test
  , tutl       =  require('./tutl')
  , cardinal   =  require('cardinal')


/* TODO: since case statements have no braces they aren't blocks, so fix these after we figure out how to handle 
 * non brace statements.
 *test('\nswitch statement', function (t) {
 *  var code = '' +
 *function outer () {
 *    switch (process.env.EDITOR) {
 *      case 'vim': return 'correct';
 *      case 'emacs': 
 *      case 'sublime': 
 *        return 'kinda works';
 *      default: return 'please select a decent editor';
 *    }
 *}
 *  , expected = [
 *      undefined
 *    , 'outer'
 *    , 'TryStatement'
 *    , 'TryStatement'
 *    , 'CatchClause'
 *    , 'CatchClause'
 *    , 'CatchClause'
 *    , 'outer'
 *    ]
 *
 *  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
 *    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
 *    t.end()
 *  })
 *  t.end()
 *})
 */
