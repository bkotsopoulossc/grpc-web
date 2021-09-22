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

const {HelloRequest, RepeatHelloRequest,
       HelloReply, Message} = require('./helloworld_pb.js');
const {GatewayClient} = require('./helloworld_grpc_web_pb.js');

const domain = 'http://localhost:8080'

var client = new GatewayClient(domain, null, null);

console.log('starting up')

console.log('about to make fetch')
const fetcher = (path, body) => {
  fetch(`${domain}${path}`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/grpc-web+proto",
      // "pragma": "no-cache",
      "x-grpc-web": "1",
      "grpc-timeout": "2500m",
      "x-user-agent": "grpc-web-javascript/0.1"
    },
    "referrer": "http://localhost:8082/",
    "body": body,
    "mode": "cors",
    // Switching this to "include" will raise cors issues
    "referrerPolicy": "strict-origin-when-cross-origin",
    // "credentials": "include",
    "method": "POST"
  })
  .then(response => {
    console.log('processing response')
    const reader = response.body.getReader();
    const beforeOpeningStream = performance.now()
    reader.read().then(function processText({ done, value }) {
      console.log('in chunk reader')

      if (done) {
        console.log('stream done')
        return
      }

      const bufLen = value[4]
      const isMsg = !Boolean(value[0])
      const protoBytes = value.slice(5, 5 + bufLen)

      console.log(`Recieved: ${value.length}, len: ${bufLen}, isMsg: ${isMsg}`)

      if (isMsg) {
        // const response = HelloReply.deserializeBinary(protoBytes)
        // console.log(`Message: ${response.getMessage()}`)
        const msgLen = protoBytes[0]
        const strLen = protoBytes[1]
        const protoAsString = new TextDecoder().decode(protoBytes).slice(2, 2 + strLen);
        console.log(`Message: ${protoAsString}`)
      } else {
        const trailers = new TextDecoder().decode(protoBytes);
        var statusCode = null
        var statusMessage = null
        trailers.split(/\r?\n/).forEach(trailer => {
          const keyValue = trailer.split(':')
          if (keyValue && keyValue.length == 2) {
            const key = keyValue[0].trim()
            const value = keyValue[1].trim()
            if (key === "grpc-status") {
              statusCode = parseInt(value)
            } else if (key === "grpc-message") {
              statusMessage = value
            }
          }
        })
        console.log(`Status: ${statusCode}, Msg: ${statusMessage}`)
      }

      return reader.read().then(processText);
    })
    .catch(error => {
      const streamTimeAliveSec = (performance.now() - beforeOpeningStream) / 1000
      console.log(`Fetch readablestream promise failed with error: ${error}, was alive for ${streamTimeAliveSec}s`)
      fetcher(path, body)
    })
  })
  .catch(error => {
    console.log(`Fetch promise failed with error: ${error}`)
    fetcher(path, body)
  })
}

// us-east-1.aws.duplex.snapchat.com:443
// us-east-1.aws.staging.duplex.snapchat.com:443
fetcher(
  "/snapchat.gateway.Gateway/Connect",
  "\u0000\u0000\u0000\u0000\u0006\n\u0004Brad"
)

// fetcher(
//   "/snapchat.gateway.Gateway/SayRepeatHello",
//   "\u0000\u0000\u0000\u0000\u000f\n\u000bSSS request\u0010\u0005"
// )

// simple unary call
// var request = new HelloRequest();
// request.setName('unary request');

// client.sayHello(request, {}, (err, response) => {
//   if (err) {
//     console.log(`Unexpected error for sayHello: code = ${err.code}` +
//                 `, message = "${err.message}"`);
//   } else {
//     console.log('JS reply from say hello')
//     console.log(response.getMessage());
//   }
// });

// var streamRequest = new RepeatHelloRequest();
// streamRequest.setName('SSS request');
// streamRequest.setCount(5);

// var stream = client.sayRepeatHello(streamRequest, {});
// stream.on('data', (response) => {
//   console.log(`Reply from sayRepeatHello: ${response.getMessage()}`);
// });
// stream.on('error', (err) => {
//   console.log(`Unexpected stream error: code = ${err.code}` +
//               `, message = "${err.message}"`);
// });

// server streaming call
// var streamRequest = new Message();
// streamRequest.setPath('Brad');

// console.log('starting connect')
// var stream = client.connect(streamRequest, {});
// stream.on('data', (response) => {
//   console.log('response from connect')
//   console.log(response.getPath());
// });
// stream.on('error', (err) => {
//   console.log(`Unexpected stream error: code = ${err.code}` +
//               `, message = "${err.message}"`);
// });
