const util = require('util');
const EventEmitter = require('events').EventEmitter;
const Decoder = require('string_decoder').StringDecoder;
const decoder = new Decoder();

class Socket {
  constructor(socket) {
    this.id = Math.floor(Date.now());
    this.socket = socket;
    this.socket.id = this.id;
    this.socket.on('data', data => {
      let normalData = Socket.messageProcessing(data);
      try {
        this.eventGeneration(normalData);
      } catch (ex) {
        console.log(ex);
      }
    });
    this.socket.on('end', this.onEndSocket);
    this.socket.on('error', this.onErrorSocket);
  }

  static messageProcessing(data) {
    const dataAsText = decoder.text(data).replace(new RegExp("\n"), '');
    const dataAsJSON = JSON.stringify(dataAsText);
    let parsedData = Socket.dataParse(dataAsJSON);
    parsedData = Socket.dataParse(parsedData);
    return parsedData
  }

  eventGeneration(rawData) {
    if (rawData.eventName !== undefined && rawData.eventData !== undefined) {
      this.emit(rawData.eventName, rawData.eventData);
    }
    return false;
  }

  send(eventName, eventData) {
    this.socket.write(JSON.stringify({
      eventName,
      eventData,
    }))
  }

  disconnect(message = null) {
    this.socket.end(message);
    this.emit('disconnect', message);
  }

  onErrorSocket(error) {
    this.emit('error', error);
  }

  onEndSocket(reason = null) {
    this.emit('disconnect', reason);
  }

  static dataParse(data = false) {
    if (!data) return false;
    try {
      return JSON.parse(data);
    } catch (JSONParseException) {
      return false;
    }
  }
}

util.inherits(Socket, EventEmitter);
module.exports = Socket;