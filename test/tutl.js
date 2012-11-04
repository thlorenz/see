'use strict';
/*jshint asi:true */

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

module.exports = {
    linenos         :  linenos
  , printCommaFirst :  printCommaFirst
};
