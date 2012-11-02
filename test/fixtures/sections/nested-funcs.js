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
};

// should sectionize as follows
// { 1-3   :  FunctionDeclaration outside
//   4-5   :  FunctionDeclaration insideUno
//   6-8   :  FunctionDeclaration nestedInsideUno
//   9-9   :  FunctionDeclaration insideUno
//   10-10 :  FunctionDeclaration outside
//   11-13 :  FunctionDeclaration insideDos
//   14-14 :  FunctionDeclaration outside
// }
// Alternatively as follows (smallest section to largest)
//
// { 6-8   :  nestedInsideUno
//   4-9   :  insideUno
//   11-13 :  insideDos
//   1-14  :  outside
// }
// 
// Or sorted by starting line.
// This could be the prep to convert to an array lineIndex -> BlockStatement
// { 1-14  :  outside
//   4-9   :  insideUno
//   6-8   :  nestedInsideUno
//   11-13 :  insideDos
// }
// [1] - outside
// [2] - outside
// [3] - outside
// [4] - inside
// etc...

'use strict';
var esprima  =  require('esprima');
var util     =  require('util');
var ast      =  esprima.parse(code, { loc: true });
var toString =  Object.prototype.toString;

function inspect (o, depth) {
  console.log(util.inspect(o, false, depth || 5, true));
}

function isObject (obj) {
  return toString.call(obj) === '[object Object]';
}

function flatten(acc, node, type) {
  // flattens ast breadth first which results in array of matching nodes sorted by location

  if (Array.isArray(node)) {
    return node.forEach(function (n) {
      flatten(acc, n, type);  
    });
  }

  if (!isObject(node)) return;

  Object.keys(node).forEach(function (k) {
    var child = node[k];
    if (child && child.type === type) { 
      child.parent = node;
      acc.push(child);
    }
  });

  Object.keys(node)
    .filter(function (k) { return k !== 'parent'; })
    .forEach(function (k) {
      flatten(acc, node[k], type);
    });
  return acc;
}

function statementLines (flattenedAst) {
  var lines = [];
  // since the flattened ast is breadth first and outer statement to inner, we can first fill
  // the entire range with the outer block and let inner blocks override where appropriate
  flattenedAst.forEach(function (statement) {
    var loc = statement.loc;
    for (var lineno = loc.start.line; lineno <= loc.end.line; lineno++) {
      lines[lineno] = statement;
    }    
  });

  return lines;
}

var flattenedAst = flatten([], ast, 'BlockStatement');

var lines = statementLines(flattenedAst);

inspect(lines);
lines.forEach(function (line) {
  console.log(line.parent.id.name);
});


























