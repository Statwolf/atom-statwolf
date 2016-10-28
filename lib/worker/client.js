'use babel';

import ipc from 'node-ipc';

export default function(id) {

  const client = {};

  client.command = function(command, payload) {
    return new Promise(function(resolve, reject) {
      ipc.connectTo(id, function() {
        ipc.of[id].on('reply', function(error, data) {
          if(error) {
            reject(error);
            return;
          }

          resolve(data);
        });

        ipc.of[id].emit(command, payload);
      });

    });
  };

  return client;

};
