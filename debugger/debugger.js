const tabs = require('./tabs');
const path = require('path');
const client = require('./client')
const EventEmitter = require('events');

module.exports = function() {
  const ee = new EventEmitter();

  ee.host = client.host;

  client.on('debugger', function(evt) {
    tabs({
      src: evt.url,
      title: 'Debugger',
      icon: 'fa fa-bug'
    });
  });

  ['open', 'close'].forEach(function(evt) {
    console.log(`Registering event ${ evt }`);
    client.on(evt, function(info) {
      console.log(`Proxying event ${ evt }`);
      ee.emit(evt, info);
    });
  });

  return ee;
};
