'use strict';
/*jshint asi:true */

var sectionize = require('../lib/sectionize')

function linenos (lines) {
  return lines
    .filter(function(_, idx) { return idx > 0; })
    .map(function (line, idx) {
      return ++idx + ': ' + line;
    })
    .join(' | ');
}

function printCommaFirst (items) {
  return items.forEach(
    function (item, idx) { 
      var comma = idx === 0 ? ' ' : ',';
      console.log('%s \'%s\'', comma, item) 
    });
}

function nameParent (statement) { 
    if (!statement) return undefined;
    var parent = statement.parent;

    if (parent.id) return parent.id.name;
    if (parent.type) return parent.type;

    return undefined;
}

function sectionizeAndNameParent(code) {
  return sectionize(code).map(nameParent);
}

function locate(statement) {
  return statement && statement.loc ? statement.loc.start.line + ':' + statement.loc.end.line : undefined;
}

function sectionizeAndLocate(code) {
  return sectionize(code).map(locate);
}

module.exports = {
    linenos                 :  linenos
  , printCommaFirst         :  printCommaFirst
  , nameParent              :  nameParent
  , sectionizeAndNameParent :  sectionizeAndNameParent
  , locate                  :  locate
  , sectionizeAndLocate     :  sectionizeAndLocate
};
