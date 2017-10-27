const net = require('net');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Socket = require('./socket');

class TCPIO {
  constructor() {
    this.sockets = [];
    this.socketServer = net.createServer((socket) => {
      if(socket === undefined) return false;
      const socketObject = new Socket(socket);
      this.sockets.push(socketObject);
      this.emit('connection', socketObject);
    });
  }

  send(toSocket, eventName, eventData) {
    this.sockets.forEach(socket => {
      if (socket.id === toSocket) {
        socket.send(eventName, eventData)
      }
    })
  }

  run(TCP_PORT) {
    return new Promise((resolve, reject) => {
      try {
        this.TCP_PORT = TCP_PORT;
        this.socketServer.listen(this.TCP_PORT, '127.0.0.1');
        resolve()
      } catch (ex) {
        reject(ex);
      }
    })
  }
}

util.inherits(TCPIO, EventEmitter);

module.exports = TCPIO;