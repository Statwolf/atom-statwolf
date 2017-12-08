const tabs = require('./tabs');
const path = require('path');
const client = require('./client')

module.exports = function() {

  tabs({
    src: path.join('file://', __dirname, 'status.html'),
    title: 'Status',
    closable: false,
    icon: 'fa fa-heart'
  });

  client.on('debugger', function(evt) {
    tabs({
      src: evt.url,
      title: 'Debugger',
      icon: 'fa fa-bug'
    });
  });

};
