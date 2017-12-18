const EventEmitter = require('events');
const ws = require('ws');
const electron = require('electron');

const _emitter = new EventEmitter();

let _client = null;
let retryId = null;

const connect = function(data) {
  if(retryId !== null) {
    clearTimeout(retryId);
  }

  if(_client !== null) {
    _client.close();
  }

  const host = _emitter.host = data.env.host.replace(/^https?:\/\//, '');

  _emitter.emit('connecting', {
    host
  });

  const currentClient = _client = new ws(`ws://${ host }:9999`);

  currentClient.on('open', function() {
    currentClient.send(JSON.stringify({ type: 'join', room: 'debug' }));

    console.log('Connected!');

    currentClient.on('message', function(msg) {
      if(msg == null) {
        return;
      }

      msg = JSON.parse(msg);

      if(msg.type !== 'debug::event') {
        return;
      }

      _emitter.emit('debugger', {
        url: msg.url.replace('127.0.0.1', host)
      });
    });

    currentClient.on('close', function() {
      console.log('Message broker connection closed... Waiting for new connection');
      _emitter.emit('close', {
        host
      });

      retryId = setTimeout(function() {
        connect(data);
      }, 500);
    });

    _emitter.emit('open', {
      host
    });
  });

  _client.on('error', function() {
    console.log('Unable to connect to message broker... Retrying');
    retryId = setTimeout(function() {
      connect(data);
    }, 500);
  });
};

const ipc = electron.ipcRenderer;
ipc.on('config', function(sender, data) {
  connect(data);
});

module.exports = _emitter;
