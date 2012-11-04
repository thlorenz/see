'use strict';
/*jshint asi:true */

var test       =  require('tap').test
  , tutl       =  require('./tutl')
  , cardinal   =  require('cardinal')

test('\ntry catch', function (t) {
  var code = '' +
function outer () {
  try {
    throw new Error('boom');
  } catch (e) {
    console.error('oh no!', e);
  }
}
  , expected = [
      undefined
    , 'outer'
    , 'TryStatement'
    , 'TryStatement'
    , 'CatchClause'
    , 'CatchClause'
    , 'CatchClause'
    , 'outer'
    ]

  t.test(cardinal.highlight(code, { linenos: true }), function (t) {
    t.deepEquals(tutl.sectionizeAndNameParent(code), expected, tutl.linenos(expected))
    t.end()
  })
  t.end()
})

