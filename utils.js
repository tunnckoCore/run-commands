'use strict'

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require)

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign

/**
 * Lazily required module dependencies
 */

require('async')
require('capture-spawn', 'capture')
require('cross-spawn-async', 'spawnAsync')
require('extend-shallow', 'extend')
require('is-real-object', 'isObject')
require('isarray', 'isArray')
require('parse-arguments', 'parseArgs')

/**
 * Restore `require`
 */

require = fn // eslint-disable-line no-undef, no-native-reassign

utils.normalizeArgs = function normalizeArgs (cmd, args, options, callback) {
  var argz = utils.parseArgs(arguments, normalizeArgs)
  if (typeof argz.args === 'function') {
    argz.callback = argz.args
    argz.args = []
    argz.options = {}
  }
  if (typeof argz.options === 'function') {
    argz.callback = argz.options
    argz.options = {}
  }
  if (utils.isObject(argz.args)) {
    argz.options = typeof argz.options === 'boolean' ? {parallel: argz.options} : argz.options
    argz.options = argz.options ? utils.extend(argz.options, argz.args) : argz.options
    argz.args = []
  }
  if (typeof argz.callback !== 'function') {
    throw new TypeError('run-commands: expect `callback` be function')
  }
  if (!utils.isArray(argz.cmd) && typeof argz.cmd !== 'string') {
    throw new TypeError('run-commands: expect `cmd` be string or array')
  }
  return argz
}

utils.factory = function factory (app, run) {
  var flow = app.options.parallel ? 'map' : 'mapSeries'

  utils.async[flow](app.cmd, function (cmd, next) {
    cmd = typeof cmd === 'string' ? {cmd: cmd} : cmd
    run(cmd.cmd, cmd.args, cmd.options, function (err, res, buf) {
      next(err, [res, buf])
    })
  }, utils.doneCallback(app.callback))
}

utils.doneCallback = function doneCallback (done) {
  return function callback (err, res) {
    var strings = []
    var buffers = []
    var len = res.length
    var i = 0

    while (i < len) {
      var val = res[i++]
      if (val[0] && val[0].length) strings.push(val[0])
      if (val[1] && val[1].length) buffers.push(val[1])
    }

    strings = strings.length === 1 ? strings[0] : strings
    buffers = buffers.length === 1 ? buffers[0] : buffers
    done(err, strings, buffers)
  }
}

utils.spawn = function spawn (app, self) {
  var callback = app.callback
  app = utils.defaultArgs(app, self)
  app = utils.spawnAsync(app.cmd, app.args, app.options)
  return utils.capture(app, callback)
}

utils.defaultArgs = function defaultArgs (app, self) {
  var argz = app.cmd.split(' ')
  app.args = utils.arrayify(app.args)
  app.args = argz.slice(1).concat(app.args)
  app.options = utils.isObject(app.options) ? app.options : {}
  app.options = utils.extend({
    parallel: false,
    stdio: [null, null, null]
  }, self.options, app.options)
  app.cmd = argz[0]

  return app
}

utils.arrayify = function arrayify (val) {
  if (!val) return []
  if (!utils.isArray(val)) return [val]
  return val
}

/**
 * Expose `utils` modules
 */

module.exports = utils
