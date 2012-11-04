'use strict';

var util = require('util');

function inspect (o, depth) {
  console.log(util.inspect(o, false, depth || 5, true));
}

module.exports = {
  inspect : inspect
};
