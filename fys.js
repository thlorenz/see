var readdirp   =  require('readdirp')
  , tap        =  require('tap-stream')
  , log        =  require('npmlog')
  , es         =  require('event-stream')
  , match      =  require('./lib/match')
  , sectionize =  require('./lib/sectionize')
  ;

function grejs (opts) {
  readdirp(opts)
    .on('error', function (err) { log.error('readdirp', err); })
    .on('warn', function (err) { log.warn('readdirp', err); })
    .pipe(match(opts.term))
    .pipe(es.mapSync(
      function (info) { 
        try {
          var sections = sectionize(info.content, info.matches);
          return { path: info.file.path, sections: sections };
        } catch (e) {
          //log.error('sectionize', e);
          return undefined;
        }
      })
    )
    .pipe(tap(2))
    ;
}

module.exports = grejs;

if (module.parent) return;

grejs({ fileFilter: '*.js', term: process.argv[2], root: '.' });  

