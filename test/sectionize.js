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
 /*01*/   'var foo = 1;'
 /*02*/ , ''
 /*03*/ , 'function add() {'
 /*04*/ , '  var bar = 2;'
 /*05*/ , '  return foo + bar;'
 /*06*/ , '}'
 /*07*/ , ''
 /*08*/ , 'module.exports = add;'
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


test('\ncode (16 lines) with two top level function declarations (3:6), (10:13)', function (t) {
  var code = [
 /*01*/   'var foo = 1;'
 /*02*/ , ''
 /*03*/ , 'function add() {'
 /*04*/ , '  var bar = 2;'
 /*05*/ , '  return foo + bar;'
 /*06*/ , '}'
 /*07*/ , ''
 /*08*/ , 'console.log("defined add going on to substract");'
 /*09*/ , ''
 /*10*/ , 'function substract() {'
 /*11*/ , '  var bar = 2;'
 /*12*/ , '  return foo - bar;'
 /*13*/ , '}'
 /*14*/ , ''
 /*15*/ , 'module.exports.add = add;'
 /*16*/ , 'module.exports.substract = substract;'
        ].join('\n')

  t.test('\n# above first function', function (t) {

    t.test('\n# # one matching line (1)', function (t) {
      var matches = [ { lineno: 1, column: 0, line: code[0] } ];
      
      t.assertLineMatches(code, matches, 1, 2).end();
    }) 
  })

  t.test('\n# inside first function', function (t) {
    
    t.test('\n# # one matching line (3)', function (t) {
      var matches = [ { lineno: 3, column: 0, line: code[2] } ];
      
      t.assertLineMatches(code, matches, 3, 6).end();
    })

    t.test('\n# # one matching line (4)', function (t) {
      var matches = [ { lineno: 4, column: 0, line: code[3] } ];
      
      t.assertLineMatches(code, matches, 3, 6).end();
    })

    t.test('\n# # one matching line (6)', function (t) {
      var matches = [ { lineno: 6, column: 0, line: code[5] } ];
      
      t.assertLineMatches(code, matches, 3, 6).end();
    })
  })

  t.test('\n# in between first and second function', function (t) {

    t.test('\n# # one matching line (8)', function (t) {
      var matches = [ { lineno: 8, column: 0, line: code[7] } ];
      
      t.assertLineMatches(code, matches, 7, 9).end();
    }) 

    t.test('\n# # one matching line (16)', function (t) {
      var matches = [ { lineno: 16, column: 0, line: code[15] } ];
      
      t.assertLineMatches(code, matches, 14, 16).end();
    }) 
  })

  t.test('\n# inside second function', function (t) {

    t.test('\n# # one matching line (10)', function (t) {
      var matches = [ { lineno: 10, column: 0, line: code[9] } ];
      
      t.assertLineMatches(code, matches, 10, 13).end();
    })

    t.test('\n# # one matching line (11)', function (t) {
      var matches = [ { lineno: 11, column: 0, line: code[10] } ];
      
      t.assertLineMatches(code, matches, 10, 13).end();
    })

    t.test('\n# # one matching line (13)', function (t) {
      var matches = [ { lineno: 13, column: 0, line: code[12] } ];
      
      t.assertLineMatches(code, matches, 10, 13).end();
    })
  })

  t.test('\n# below second function', function (t) {

    t.test('\n# # one matching line (15)', function (t) {
      var matches = [ { lineno: 15, column: 0, line: code[14] } ];
      
      t.assertLineMatches(code, matches, 14, 16).end();
    }) 

    t.test('\n# # one matching line (16)', function (t) {
      var matches = [ { lineno: 16, column: 0, line: code[15] } ];
      
      t.assertLineMatches(code, matches, 14, 16).end();
    }) 
  })
})

test('\ncode (8 lines) with top level if statement (3:6)', function (t) {
  var code = [
 /*01*/   'var foo = 1;'
 /*02*/ , ''
 /*03*/ , 'if (foo > 0) {'
 /*04*/ , '  var bar = 2;'
 /*05*/ , '  console.log(foo + bar);'
 /*06*/ , '}'
 /*07*/ , ''
 /*08*/ , 'module.exports = add;'
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
