'use babel';

import jobCounter from '../utils/job-counter';
import { Task, Disposable } from 'atom';
import n from '../utils/notifications';
import path from 'path';
import clientFactory from '../worker/client';

export default function(components, d) {

  jobCounter.addJob();

  let serverTask = new Task(require.resolve('../worker/server'));
  serverTask.on('server-ready', function() {
    console.log('Statwolf worker ready.');
    const client = clientFactory(serverTask);

    components['push-manager'](client);
    components.console(client);

    jobCounter.removeJob();
  });

  let onDispose = function() {
    console.log('Terminating worker task');
    serverTask.terminate();
  };
  d.add(new Disposable(onDispose));

  serverTask.start();
};
