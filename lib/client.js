const net = require('net');
const util = require('util');
const Socket = require('./socket');
const EventEmitter = require('events').EventEmitter;

class TCPClient {
  constructor(serverUrl, serverPort) {
    this.client = new net.Socket();
    this.client.connect(serverPort, serverUrl, () => {
      this.onSocketConnected(this.client);
    });
  }
  onSocketConnected(socket) {
    this.socket = new Socket(socket);
    this.emit('connection', this.socket);
  }
}

util.inherits(TCPClient, EventEmitter);

module.exports = TCPClient;