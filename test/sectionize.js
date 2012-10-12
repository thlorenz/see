'use strict';

/*jshint asi:true */

var test = require('tap').test
  , sectionize = require('../lib/sectionize');

test('adding custom asserts ... ', function (t) {
  t.constructor.prototype.assertLineMatches = function (code, matches, start, end) {
    var key = start + ':' + end
      , sections = sectionize(code, matches);

    this.equals(sections[key].start, start, 'section starts at line ' + start)
    this.equals(sections[key].end, end, 'section ends at line ' + end)
    this.equals(sections[key].lines.length, matches.length, 'section matched ' + matches.length + ' lines')

    for (var i = 0; i < matches.length; i++) {
      this.equals(sections[key].lines[i], matches[i], 'section includes matched line ' + (i + 1))
    }
    return this;
  }

  t.end() 
})


test('\ncode (2 lines) with only top level declarations', function (t) {
  var code = [
          'var foo = 1;'
        , 'console.log(foo);'
      ].join('\n')

  t.test('\n# and one matching line (1)', function (t) {
    var matches = [ { lineno: 1, column: 0, line: code[0] } ]
    
    t.assertLineMatches(code, matches, 1, 2).end();
  })

  t.test('\n# and two matching lines (1, 2)', function (t) {
    var matches = [ 
          { lineno: 1, column: 0, line: code[0] } 
        , { lineno: 2, column: 0, line: code[1] } 
        ]
    
    t.assertLineMatches(code, matches, 1, 2).end();
  })
});

test('\ncode (8 lines) with top level function declaration (3:6)', function (t) {
  var code = [
          'var foo = 1;'
        , ''
        , 'function add() {'
        , '  var bar = 2;'
        , '  return foo + bar;'
        , '}'
        , ''
        , 'module.exports = add;'
        ].join('\n')

  t.test('\n# and one matching line (3)', function (t) {
    var matches = [ { lineno: 3, column: 0, line: code[4] } ];
    
    t.assertLineMatches(code, matches, 3, 6).end();
  })

  t.test('\n# and two matching lines (3, 5)', function (t) {
    var matches = [ 
        { lineno: 3, column: 2, line: code[4] } 
      , { lineno: 5, column: 2, line: code[6] } 
      ];
    
    t.assertLineMatches(code, matches, 3, 6).end();
  })

  t.test('\n# and one matching line (1)', function (t) {
    var matches = [ { lineno: 1, column: 0, line: code[0] } ];
    
    t.assertLineMatches(code, matches, 1, 2).end();
  }) 

  t.test('\n# and one matching line (8)', function (t) {
    var matches = [ { lineno: 8, column: 0, line: code[7] } ];
    
    t.assertLineMatches(code, matches, 7, 8).end();
  })
})
