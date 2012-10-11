'use strict';
var fs = require('fs')
  , util = require('util')
  , acorn = require('acorn')
  , blockTypes = [
      'FunctionDeclaration'
    , 'FunctionExpression'
    , 'IfStatement'
    , 'DoWhileStatement'
    , 'WhileStatement'
    , 'ForStatement'
    , 'ForInStatement'
    , 'WithStatement'
    , 'SwitchStatement'
    , 'TryStatement'
    ]
    // Found inside other blocks
  , subblockTypes = [
      'BlockStatement'
    , 'SwitchCase'
    , 'CatchClause'
    , 'BlockStatement'
    ]
    // Can be short or span multiple lines
  , expressionTypes = [
      'ObjectExpression'
    , 'ArrayExpression'
    ]
  , js = fs.readFileSync(__dirname + '/sample-02.js', 'utf-8')
  , ast
  ;

function inspect (s, depth) {
  console.log(util.inspect(s, false, depth || 5, true));
}

function getSections (node, sectionTypes) {
  return node.filter(function (n) {
    return ~sectionTypes.indexOf(n.type);
  });
}

function getBlocks (node) {
  return getSections(node, blockTypes);
}

function getSubblocks (node) {
  return getSections(node, subblockTypes);
}

function getExpressions (node) {
  return getSections(node, expressionTypes);
}

function bucketize(lineInfos, blocks, parent) {
  // Keep in mind that lines in the ast are 1 based
  var bucket = []
    , block
    , infoIdx = 0
    , info
    , infoLineno
    , blockStart
    , blockEnd
    , sections = { } 
    , sectionkey
    , parentStart = parent.start.line
    , parentEnd = parent.end.line
    ;

  parent.matches = parent.matches || [];

  // attaches matched lineinfo to the section it matched
  function addToSection (start, end, info, block) {

      sectionkey = util.format('%d:%d', start, end);

      if (!sections[sectionkey]) 
        sections[sectionkey] = { start: start, end: end, lines: [],  block: block };

      sections[sectionkey].lines.push(info);
  }

  // Assume that lineInfos are sorted by lineno

  for (var blockIdx = 0; blockIdx < blocks.length && infoIdx < lineInfos.length; blockIdx++) {
    block = blocks[blockIdx];
    block.matches = [];

    // Find all lines that are inside this block
    while (infoIdx < lineInfos.length) {
      info = lineInfos[infoIdx];
      infoLineno = info.lineno;

      blockStart = block.start.line;
      blockEnd = block.end.line;

      if (blockStart <= infoLineno && infoLineno <= blockEnd) {
        // Inside the current block
        
        addToSection (blockStart, blockEnd, info, block);

        infoIdx++;
      } else if (infoLineno < block.start.line) {
        // It wasn't inside the previous block, but is before the current one, so it is directly on the parent

        addToSection (parentStart, parentEnd, info, parent);
        infoIdx++;
      } else {
        // Either in next block or on parent level after this block
        // So break here to advance to the next block
        break;
      }
    }
  }

  // If we are below the last block and still have matching lines, then they must belong to the parent
  for (var remainingIdx = infoIdx; remainingIdx  < lineInfos.length; remainingIdx++) {
    addToSection(parentStart, parentEnd, lineInfos[remainingIdx], parent);
  }


  return sections;
}


ast = acorn.parse(js, { linePositions: true } );

var top = ast.body
  , blocks = getBlocks(top);

top.start = ast.start;
top.end = ast.end;

var lineInfos = [
    { key: 2, lineno: 1 }
  , { key: 4, lineno: 3 }
  , { key: 6, lineno: 6 }
];

var sections = bucketize(lineInfos, blocks, top);
inspect(sections, 4);
//inspect(blocks, 2);




