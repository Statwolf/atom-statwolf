'use babel';

import ipc from 'node-ipc';

import Statwolf from 'statwolf';
const statwolf = new Statwolf();

ipc.config.id = Math.random().toString(16).split('.')[1];

ipc.serve(function() {

  ipc.server.on('push', function(data, socket) {
    console.log(data);
    ipc.server.emit(socket, 'reply', { a: 'a' });

  });

  emit('socket-ready', ipc.config.id);

});

ipc.server.start();
