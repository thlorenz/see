var es =  require('event-stream')
  , fs =  require('fs')
  ;

function readContentAndFindMatchingLines (searchTerm) {

  // Calls back with content attached to entry and a lines info array
  return es.map(function (entry, cb) {
    var lineno = 0
      , allLines = []
      , matchingLineInfos = []
      , fileStream = this;

    function filter () {
      return es.mapSync(function (line) {
        allLines.push(line);

        lineno++;
        var column = line.indexOf(searchTerm);
        return column >= 0 ? { lineno: lineno, column: column, line: line } : undefined;
      });
    }

    function aggregate () {
      return es.through(
          function write (data) { 
            matchingLineInfos.push(data); 
          }
        , function end () {
            if (matchingLineInfos.length) {

              var result = { file: entry, matches: matchingLineInfos, lines: allLines }; 

              cb(null, result);
            } else {
              // drop files that had no matches
              cb();
            }
          }
      );
    }

    fs.createReadStream(entry.fullPath, { encoding: 'utf-8' })

      // handle file contents line by line
      .pipe(es.split('\n'))

      // keep only the lines that matched the term
      .pipe(filter())

      // aggregate all matching lines, attach content and call back
      .pipe(aggregate())
      ;
  });
}

module.exports = readContentAndFindMatchingLines;
