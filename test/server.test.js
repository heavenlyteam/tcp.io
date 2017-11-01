const assert = require('assert');
const TCPServer = require('../lib').tcpServer;
const TCPClient = require('../').tcpClient;
let tcp;

describe('Base server test case', function () {
  it('start server on port 8088', function (done) {
    tcp = new TCPServer();
    tcp.run(8088).then(startedOnPort => {
      if (8088 === startedOnPort) {
        done();
      } else {
        done(false);
      }
    }).catch((ex) => done(ex));
  });
  it('server accept incoming connection', function (done) {
    const test = new TCPClient('127.0.0.1', 8088);
    tcp.on('connection', data => {
      done();
    })
  })
  it('server stop', function (done) {
    tcp.destroy().then(() => {
        done();
        process.exit();
      })
      .catch(ex => done(ex));
  })
});