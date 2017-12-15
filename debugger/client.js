const EventEmitter = require('events');
const ws = require('ws');
const electron = require('electron');

const _emitter = new EventEmitter();

let _client = null;

const connect = function(data) {
  if(_client !== null) {
    _client.close();
  }

  const host = _emitter.host = data.env.host.replace(/^https?:\/\//, '');

  _client = new ws(`ws://${ host }:9999`);

  _client.on('open', function() {
    _client.send(JSON.stringify({ type: 'join', room: 'debug' }));

    console.log('Connected!');

    _client.on('message', function(msg) {
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

    _client.on('close', function() {
      _emitter.emit('close', {
        host
      });
    });

    _emitter.emit('open', {
      host
    });
  });

};

const ipc = electron.ipcRenderer;
ipc.on('config', function(sender, data) {
  connect(data);
});

module.exports = _emitter;
