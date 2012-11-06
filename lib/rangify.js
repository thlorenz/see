/* function outside () {           [ 1, 12 ]    [ 1, 12 ]                                
  var out;                         [ 1, 12 ]    [ 2, 2 ]                                         
  function insideUno () {          [ 3, 8 ]     [ 3, 8 ]                                                               
    var uno;                       [ 3, 8 ]     [ 4, 4 ]                                                  
    function nestedInsideUno () {  [ 5, 7 ]     [ 5, 7 ]                
      var nest;                    [ 5, 7 ]     [ 5, 7 ]                                                     
    }                              [ 5, 7 ]     [ 5, 7 ]                                           
  }                                [ 3, 8 ]     [ 3, 8 ]                                         
  function insideDos () {          [ 9, 11 ]    [ 9, 11 ]                                                              
    var dos;                       [ 9, 11 ]    [ 9, 11 ]                                                 
  }                                [ 9, 11 ]    [ 9, 11 ]                                        
}                                  [ 1, 12 ]    [ 1, 12 ]             
                                   first pass   result              */
'use strict';
function locate(statement) {
  return statement && statement.loc 
    ? [ statement.loc.start.line, statement.loc.end.line ] 
    : undefined;
}

function areEqual(range1, range2) {
  return range1[0] == range2[0] && range1[1] == range2[1];
}

function rangeStartsOrEndsHere(range, line) {
  return range[0] === line || range[1] === line;
}

function findStopperFwd(ranges, line, range) {
  for (var i = line; i <= range[1]; i++) {
    if (!areEqual(ranges[i], range)) return i;
  }
  return range[1];
}

function findStopperBwd(ranges, line, range) {
  for (var i = line; i >= range[0]; i--) {
    if (!areEqual(ranges[i], range)) return i;
  }
  return range[0];
}

function subLocate(ranges, line) {
  var range = ranges[line];

  if (rangeStartsOrEndsHere(range, line)) return range;

  var stopperBwd = findStopperBwd(ranges, line, range);
  var stopperFwd = findStopperFwd(ranges, line, range);

  // special case for blocks with one line body -> include head and footer
  if ( stopperFwd - stopperBwd <= 3
    && areEqual(ranges[stopperBwd], range)
    && areEqual(ranges[stopperFwd], range)) return range;
  
  return [ stopperBwd + 1, stopperFwd - 1 ];
}

function rangify(statements) {
  var located = statements.map(locate)
    , line
    , subLocated = [ undefined ];

  for (line = 1; line < located.length; line++) {
     subLocated[line] = subLocate(located, line);
  }
  return subLocated;
}

module.exports = rangify;

if (module.parent) return;

var sectionize = require('./sectionize');

var code = '' +
function outer () {
  var foo = 'foo';
  if (true) {
    console.log('true');
  } else {
    return false;
  }
};

var result = rangify(sectionize(code));
console.log(result);
