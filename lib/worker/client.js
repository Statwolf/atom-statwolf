'use babel';

import dataStore from '../utils/data-store';

const env = dataStore('env');

export default function(server) {

  const client = {};

  client.command = function(command, payload) {
    const envData = env.getData();
    const currentEnv = envData.env;

    payload = Object.assign({
      userid: currentEnv.userId,
      host: currentEnv.host,
      port: currentEnv.port,
      token: currentEnv.token
    }, payload);

    return new Promise(function(resolve, reject) {
      const id = Math.random().toString(16).split('.')[1];

      server.once(id, function(reply) {
        if(reply.error) {
          reply.error.logs = reply.data.logs;
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
