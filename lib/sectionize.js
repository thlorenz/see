'use strict';
var esprima  =  require('esprima')
  , inspect  =  require('./utl').inspect
  , toString =  Object.prototype.toString
  ;

function isObject (obj) {
  return toString.call(obj) === '[object Object]';
}

function flatten(acc, node, parent) {
  // flattens ast breadth first which results in array of matching nodes sorted by location

  if (Array.isArray(node)) {
    return node.forEach(function (n) {
      flatten(acc, n);  
    });
  }

  if (!isObject(node)) return;

  if (node.type === 'SwitchStatement') {
    acc.push(node);
  }

  Object.keys(node).forEach(function (k) {
    var child = node[k];
    if (!child) return;

    switch (child.type) {
      // case 'IfStatement': TODO: decide if we handle unbraced statements
      case 'SwitchStatement':
      case 'BlockStatement':
        child.parent = node;
        return acc.push(child);
    }
  });

  Object.keys(node)
    .filter(function (k) { return k !== 'parent'; })
    .forEach(function (k) {
      flatten(acc, node[k]);
    });
  return acc;
}

function statementLines (flattenedAst) {
  // there is no line 0 and we want to avoid holes inside lines array
  var lines = [ undefined ];

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

function sectionize(code) {
  var ast      =  esprima.parse(code, { loc: true })
    , flattenedAst = flatten([], ast)
    , lines = statementLines(flattenedAst);

  return lines;
}

module.exports = sectionize;

if (module.parent) return;

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
};

sectionize(code);
