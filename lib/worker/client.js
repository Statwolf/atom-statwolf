'use babel';

export default function(server) {

  const client = {};

  client.command = function(command, payload) {

    return new Promise(function(resolve, reject) {
      const id = Math.random().toString(16).split('.')[1];

      server.once(id, function(reply) {
        if(reply.error) {
          reject(reply.error);
          return;
        }

        resolve(reply.data);
      });

      server.send({
        id,
        command,
        payload
      });

    });

  };

  return client;

};
