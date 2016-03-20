/*!
 * run-commands <https://github.com/tunnckoCore/run-commands>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var runCommands = require('./index')

test('foo', function (done) {
  runCommands([
    'echo foo',
    {cmd: 'echo', args: ['bar', 'qux']},
    'echo zzz',
    {cmd: 'echo www'}
  ], done)
})

// Signatures:
// runCommands(String, Array, Object, Function)
// runCommands(String, Object, Function)
// runCommands(String, Function)
// runCommands(Array<String|Object>, Object, Function)
// runCommands(Array<String|Object>, Function)
