'use babel';

import config from '../utils/configurations';
import { Task } from 'atom';

import ipc from 'node-ipc';

export default function(d) {

  var serverTask = new Task(`${ __dirname }/../worker/server`);
  serverTask.on('socket-ready', function(id) {

    console.log(`Statwolf worker ready. ID is ${ id }`);


  });

};
