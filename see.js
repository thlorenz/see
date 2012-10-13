#!/usr/bin/env node

var readdirp   =  require('readdirp')
  , tap        =  require('tap-stream')
  , log        =  require('npmlog')
  , es         =  require('event-stream')
  , match      =  require('./lib/match')
  , sectionize =  require('./lib/sectionize')
  ;

function hashToArray (hash) {
  return Object.keys(hash).map(function (k) {
    return hash[k];
  });
}

function sectionizeCode (info) {
  try {
    var sectionsHash = sectionize(info.content, info.matches)
      , sections = hashToArray(sectionsHash);

    return { path: info.file.path, sections: sections };
  } catch (e) {
    // TODO: in case we cannot parse, we need to manually sectionize the lines (e.g., one line sections)
    //log.error('sectionize', e);
    return undefined;
  }
}

function simplePrint (info) {
  var text = info.sections
    .map(function (sec) {
      return sec.lines
        .map(function (lineinfo) {
          return lineinfo.lineno + ':' + lineinfo.line;
        })
        .join('\n');
    })
    .join('\n');

  return '\n===================\n' + info.path + ':\n' + text;
}

function see (opts) {
  readdirp(opts)
    .on('error', function (err) { log.error('readdirp', err); })
    .on('warn', function (err) { log.warn('readdirp', err); })
    .pipe(match(opts.term))
    .pipe(es.mapSync(sectionizeCode))
    .pipe(es.mapSync(simplePrint))
    .pipe(process.stdout)
    ;
}

module.exports = see;

if (module.parent) return;

see({ fileFilter: '*.js', term: process.argv[2], root: '.' });  

