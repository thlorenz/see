var readdirp =  require('readdirp')
  , tap      =  require('tap-stream')
  , log      =  require('npmlog')
  , es       =  require('event-stream')
  , findMatchingLines  =  require('./lib/matcher')
  ;

function grejs (opts) {
  readdirp(opts)
    .on('error', function (err) { log.error('readdirp', err); })
    .on('warn', function (err) { log.warn('readdirp', err); })
    .pipe(findMatchingLines(opts.term))
    .pipe(es.mapSync(function (info) { return { path: info.file.path, lines: info.lines }; }))
    .pipe(tap(2))
    ;
}

module.exports = grejs;

if (module.parent) return;

grejs({ fileFilter: '*.js', term: process.argv[2], root: '.' });  

