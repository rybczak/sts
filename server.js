#!/usr/bin/env node
"use strict";

var ApplicationServer = require('./bin/server/appServer');
var GameServer = require('./bin/server/gameServer');
var io = require('socket.io');
var express = require('express');
var uuid = require('uuid');
var http = require('http');

var port = process.env.PORT || 3000;
var applicationServer = ApplicationServer.Server.bootstrap();

var gameServer = new GameServer.GameServer();
var server = http.createServer(applicationServer.app);
server.listen(port);
console.log('\t :: Express :: Listening on port ' + port);

var sio = io.listen(server);
sio.sockets.on('connection', function (client) {
    client.userid = uuid();
    var newPlayer = gameServer.addNewPlayer(client.userid);
    client.emit('onconnected', { player: newPlayer });
    //game on client connect behaviour
    console.log('\t :: socket.io :: player ' + client.userid + ' connected');
    
    client.on('message', function (msg) {
        //add data to processing queue
        console.log('\t :: socket.io :: message received: { ' + msg.id + ', ' + msg.move + ' }');
        gameServer.movePlayer(msg.id, msg.move);
    });

    client.on('disconnect', function () {
        gameServer.removePlayer(client.userid);
        console.log('\t :: socket.io :: player ' + client.userid + ' disconnected');
    });
});

setInterval(function() {
        var data = gameServer.getData();
        sio.sockets.emit('update', { data: data });
        console.log('\t :: socket.io :: update');
}, 1000);