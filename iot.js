// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
var awsIot = require('aws-iot-device-sdk');
const express = require('express');
const socket = require('./socket.js')

const app = express();

app.use(express.json());

// headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  next();
})

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
var device = awsIot.device({
  keyPath: './private.key',
  certPath: './cert.crt',
  caPath: './ca1.pem',
  clientId: 'krishian_demo',
  host: 'a5w65rwe85abg-ats.iot.us-east-1.amazonaws.com',
});

var baal = 'foo';

let resp_count = 0;
let tempData = '';
//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
  .on('connect', function () {
    resp_count === 0;
    console.log('Connected to the Sensors');
    device.subscribe('terraceTemp');
    device.publish('topic_2', JSON.stringify({ test_data_topu: 1 }));
    socket.getIO().emit('onConnect',
      {
        message: "Connected to Server", isSuccess: true
      }
    )
  });



device
  .on('message', function (topic, payload) {
    resp_count++
    let data = JSON.parse(payload.toString())
    tempData = {
      no: resp_count,
      topic,
      body: data
    }
    console.log(tempData);
    var sub_extract = payload;
    var sensor_values = JSON.parse(sub_extract); //Class_object

    socket.getIO().emit('newInfo',
      {
        message: "Receiving Data...", isSuccess: true, result: tempData
      }
    )

    // var temp = sensor_values.Temperature; // Objectt.KEY
    // var sen1 = sensor_values.Sensor1;//// object.KEY
    // var sen2 = sensor_values.Sensor2;//// object.KEY


    // console.log('Temp test: ', temp, '  ', typeof temp, ' Sensor1 test: ', sen1, ' Sensor2 test: ', sen2); /// 'normal string', Variable

  });

//   app.listen(8080);
//   app.get('/',(req,res) => {
//       res.render('topu', { tit : temp})
//   });

// *********************************** controllers **********************
const handler = (req, res) => {
  let data = {
    title: 'Temp data',
    data: tempData,
  }
  res.send(data)
}

// ********************************** routes *****************************
app.get('/', handler);

const server = app.listen(port = 8080, host = 'localhost', () => {
  console.log(`Server runnting at http://${host}:${port}`);
});

const io = socket.init(server);
io.on('connection', socket => {
  // this will only be logged if any client is connected
  console.log('Client has connected');
})


