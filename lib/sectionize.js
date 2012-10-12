'use strict';
var acorn = require('acorn')
  , util = require('util')
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
  ;

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
  // lines in the ast are 1 based while columns are 0 based
  var bucket = []
    , block
    , nextBlock
    , prevBlockEnd
    , infoIdx = 0
    , info
    , infoLineno
    , blockStart
    , blockEnd
    , sections = { } 
    , sectionkey
    , parentStart =  parent.start.line
    , parentEnd   =  parent.end.line
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
        addToSection (prevBlockEnd ? prevBlockEnd + 1 : parentStart, blockStart - 1, info, parent);
        infoIdx++;
      } else {
        // Either in next block or on parent level after this block
        // So break here to advance to the next block
        break;
      }
    }

    prevBlockEnd = blockEnd;
  }

  prevBlockEnd = prevBlockEnd ? prevBlockEnd + 1 : parentStart;

  // If we are below the last block and still have matching lines, then they must belong to the parent
  for (var remainingIdx = infoIdx; remainingIdx  < lineInfos.length; remainingIdx++) {
    addToSection(prevBlockEnd, parentEnd, lineInfos[remainingIdx], parent);
  }

  return sections;
}

function sectionize (content, lines) {
  // TODO: try catch parse errors
  var ast = acorn.parse(content, { linePositions: true })
    , top = ast.body
    , blocks = getBlocks(top);

  top.start = ast.start;
  top.end = ast.end;

  return bucketize(lines, blocks, top);
}


module.exports = sectionize;
