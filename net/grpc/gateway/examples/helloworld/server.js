/**
 *
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = __dirname + '/helloworld.proto';

var assert = require('assert');
var async = require('async');
var _ = require('lodash');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var protoPkg = protoDescriptor.snapchat.gateway;

/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doSayHello(call, callback) {
  console.log('starting doSayHello')

  callback(null, {message: 'Hello! '+ call.request.name});
}

/**
 * @param {!Object} call
 */
function doSayRepeatHello(call) {
  console.log(`starting doSayRepeatHello with ${JSON.stringify(call.request)}`)

  var senders = [];
  function sender(name) {
    return (callback) => {
      call.write({
        message: 'Hey! ' + name
      });
      _.delay(callback, 1000); // in ms
    };
  }
  for (var i = 0; i < 3; i++) {
    senders[i] = sender('from backend: ' + i);
  }
  console.log('about to end')
  async.series(senders, () => {
    console.log('end')
    call.end();
  });
  console.log('done')
}

function doConnect(call) {
  console.log(`starting doConnect from ${call.request.path}`)

  var senders = [];
  function sender(name) {
    return (callback) => {
      const writeback = 'Hey! ' + name
      console.log(`writing back: ${writeback}`)
      call.write({
        path: writeback
      });
      _.delay(callback, 1000); // in ms
    };
  }
  for (var i = 0; i < 3; i++) {
    senders[i] = sender(call.request.path + i);
  }
  console.log('about to end')
  async.series(senders, () => {
    console.log('end')
    call.end();
  });
  console.log('done')
}

function doConnect2(call) {
  call.on('data', function(msg) {
    console.log(`doConnect2 on data: ${msg.path}`)

    var senders = [];
    function sender(name) {
      return (callback) => {
        const writeback = 'Hey! ' + name
        console.log(`writing back: ${writeback}`)
        call.write({
          path: writeback
        });
        _.delay(callback, 1000); // in ms
      };
    }
    for (var i = 0; i < 3; i++) {
      senders[i] = sender(msg.path + i);
    }
    console.log('about to end')
    async.series(senders, () => {
      console.log('done writing back')
      call.end();
    });
    console.log('done processing onConnect')
  });
  call.on('end', function() {
    console.log('on end')
  });
}

/**
 * @return {!Object} gRPC server
 */
function getServer() {
  var server = new grpc.Server();
  server.addService(protoPkg.Gateway.service, {
    sayHello: doSayHello,
    sayRepeatHello: doSayRepeatHello,
    connect: doConnect2,
  });
  return server;
}

if (require.main === module) {
  console.log('starting server')
  var server = getServer();
  server.bindAsync(
    '0.0.0.0:9090', grpc.ServerCredentials.createInsecure(), (err, port) => {
      assert.ifError(err);
      server.start();
  });
}

exports.getServer = getServer;
