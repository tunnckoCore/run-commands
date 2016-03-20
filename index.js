/*!
 * run-commands <https://github.com/tunnckoCore/run-commands>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

var runner = module.exports = function runner (cmd, args, options, callback) {
  var app = utils.normalizeArgs(cmd, args, options, callback)
  if (utils.isArray(app.cmd)) {
    utils.factory(app, runner)
    return
  }
  if (typeof app.cmd !== 'string') {
    throw new TypeError('run-commands: expect `cmd` be string or array')
  }
  return utils.spawn(app, this || {})
}

runner.series = function series () {
  return runner.apply({options: {parallel: false}}, arguments)
}

runner.parallel = function parallel () {
  return runner.apply({options: {parallel: true}}, arguments)
}
