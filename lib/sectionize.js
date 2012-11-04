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

  if (!node) return; 

  // process current node
  switch (node.type) {
    case 'IfStatement': 
    case 'SwitchStatement':
    case 'BlockStatement':
      node.parent = parent;
      acc.push(node);
  }

  // children could be array (e.g., body)
  if (Array.isArray(node)) {
    return node.forEach(function (n) {
      flatten(acc, n, node);  
    });
  }

  // if neither array nor body, we don't need to process any children
  if (!isObject(node)) return;

  Object.keys(node)
    .filter(function (k) { return k !== 'parent'; })
    .forEach(function (k) {
      flatten(acc, node[k], node);
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
    , flattenedAst = flatten([], ast, undefined)
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
  }
};

var ast      =  esprima.parse(code, { loc: true });
var flattenedAst = flatten([], ast, undefined)
  , sectionized = sectionize(code);

inspect(flattenedAst.map(function (x) { return x.type; }));
inspect(sectionized);




