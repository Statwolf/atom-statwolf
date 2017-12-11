const EventEmitter = require('events');
const ws = require('ws');

const _emitter = new EventEmitter();

const connect = function(data) {
  const host = data.env.host.replace(/^https?:\/\//, '');

  const _client = new ws(`ws://${ host }:9999`);
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

    _emitter.emit('open', {
      host
    });
  });

};

connect(JSON.parse(localStorage.getItem('env')));

module.exports = _emitter;
