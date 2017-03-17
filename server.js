#!/usr/bin/env node
"use strict";

var ApplicationServer = require('./bin/server/appServer');
//var GameServer = require('../game');
var io = require('socket.io');
var express = require('express');
var uuid = require('uuid');
var http = require('http');

var port = process.env.PORT || 3000;
var applicationServer = ApplicationServer.Server.bootstrap();

var server = http.createServer(applicationServer.app);
server.listen(port);
console.log('\t :: Express :: Listening on port ' + port);

var sio = io.listen(server);
sio.sockets.on('connection', function (client) {
    client.userid = uuid();
    client.emit('onconnected', { id: client.userid });
    //game on client connect behaviour
    console.log('\t :: socket.io :: player ' + client.userid + ' connected');
    
    client.on('message', function (msg) {
        //game on message behaviour
        console.log('\t :: socket.io :: message received: ' + msg);
    });

    client.on('disconnect', function () {
        console.log('\t :: socket.io :: player ' + client.userid + ' disconnected');
        //game on end behaviour
    });
});