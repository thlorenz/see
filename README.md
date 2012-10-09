# grejs [![Build Status](https://secure.travis-ci.org/thlorenz/grejs.png)](http://travis-ci.org/thlorenz/grejs)

[Grep](http://en.wikipedia.org/wiki/Grep) inspired tool to find references inside JavaScript files.

[grejs](http://www.urbandictionary.com/define.php?term=grejs) are supposed to be extraterrestial intelligent non human
beings who are captured and held in secret labs deep within Area 51 and perhaps the Cheyenne Mtn base.

## Current status

In development, not functional yet.

## Features it will have

- when logging a match to the console, include the enclosing scope to provide context (i.e. show the entire function
	that contained the match instead of just the line on which the match was found)
- to ignore matches found inside comments and/or strings
- limit matches to function names, variable names, etc., only

## Features it may have

- syntax highlight matches
- interactive mode supplementing cli
- .grejs per project file for local defaults
- .grejs per user file for global defaults

## CLI options

- `--maxlines` max num of lines per match (i.e. if containing function body is larger than that, we only print part of it)
- `--comments` include matches found inside comments
- `--strings` includes matches inside strings
- `--nowarn` don't print warning when file was unparsable by acorn
- `--nocolor` don't syntax highlight matches 
- `--function` match calls to functions and function declarations
- `--funcdec` match function declarations only

