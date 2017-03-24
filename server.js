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
    var requests = [];

    client.broadcast.emit("online", { name: newPlayer.name });

    client.emit('onconnected', { player: newPlayer, timestamp: Date.now(), online: gameServer.getPlayersNumber() });
    //game on client connect behaviour
    console.log('\t :: socket.io :: player ' + client.userid + ' connected');

    client.on('message', function (msg) {
        var self = this;
        //add data to processing queue
        console.log('\t :: socket.io :: message received: { ' + msg.date + ', ' + msg.sequence + ', ' + msg.id + ', ' + msg.move + ' }');
        gameServer.movePlayer(msg.date, msg.sequence, msg.id, msg.move);
    });

    client.on('chatMessage', function (data) {
        client.broadcast.emit("chatMessage", { message: data.message, user: data.user });
    });

    client.on('disconnect', function () {
        client.broadcast.emit("offline", { name: newPlayer.name });
        gameServer.removePlayer(client.userid);
        console.log('\t :: socket.io :: player ' + client.userid + ' disconnected');
    });
});

setInterval(function () {
    var data = gameServer.getData();
    sio.sockets.emit('update', { data: data, timestamp: Date.now(), online: gameServer.getPlayersNumber() });
    console.log('\t :: socket.io :: update');
}, 100);