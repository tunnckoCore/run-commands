/*!
 * run-commands <https://github.com/tunnckoCore/run-commands>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Run commands in series by default, pass `options.parallel: true`
 * to run them on parallel.
 *
 * @param  {String|Array} `cmd`
 * @param  {String|Array|Object|Function=} `args`
 * @param  {Object|Function=} `options`
 * @param  {Function} `callback`
 * @return {Stream}
 * @api public
 */

var runCommands = module.exports = function runCommands (cmd, args, options, callback) {
  var app = utils.normalizeArgs(cmd, args, options, callback)
  if (utils.isArray(app.cmd)) {
    utils.factory(app, runCommands)
    return
  }
  if (typeof app.cmd !== 'string') {
    throw new TypeError('run-commands: expect `cmd` be string or array')
  }
  return utils.spawn(app, this || {})
}

/**
 * > Run commands in series. Alias for `runCommands`.
 *
 * @param  {String|Array} `cmd`
 * @param  {String|Array|Object|Function=} `args`
 * @param  {Object|Function=} `options`
 * @param  {Function} `callback`
 * @return {Stream}
 * @api public
 */

runCommands.series = function series () {
  var ctx = {options: {
    parallel: false
  }}
  return runCommands.apply(ctx, arguments)
}

/**
 * > Run commands in parallel.
 *
 * @param  {String|Array} `cmd`
 * @param  {String|Array|Object|Function=} `args`
 * @param  {Object|Function=} `options`
 * @param  {Function} `callback`
 * @return {Stream}
 * @api public
 */

runCommands.parallel = function parallel () {
  return runCommands.apply({options: {parallel: true}}, arguments)
}
