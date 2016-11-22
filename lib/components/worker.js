'use babel';

import jobCounter from '../utils/job-counter';
import { Task, Disposable } from 'atom';
import n from '../utils/notifications';
import path from 'path';
import clientFactory from '../worker/client';

export default function(components, d) {

  jobCounter.addJob();

  const onReady = function() {
    let serverTask = new Task(`${ __dirname }/../worker/server`);
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
    d.add(new Disposable(onDispose))
  };

  try {
    require('statwolf');
    onReady();
  } catch(e) {
    n.info('Statwolf installation', 'Installing Statwolf module...');
    var npm = require('npm');

    npm.load({
      registry: 'http://dev.statwolf.com:5984/',
      prefix: path.join(__dirname, '..', '..')
    }, function(e) {
      npm.commands.install([ 'statwolf' ], function(e, data) {
        if(e) {
          throw e;
        }

        n.info('Statwolf installation', 'Statwolf installed');
        onReady();
      });
    });
  }

};
