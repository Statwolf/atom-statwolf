'use babel';

import { CompositeDisposable, Task } from 'atom';
import requireDir from 'require-dir';
import clientFactory from './worker/client';
import dataStore from './utils/data-store';

let _disposable;

const _components = requireDir('./components');

export default {

  activate(state) {
    _disposable = new CompositeDisposable()

    _components.configurations(_disposable);

    console.log('Statwolf plugin activated');
  },

  consumeStatusBar(statusBar) {
    _components['env-indicator'](statusBar);
    _components['status-indicator'](statusBar);
    _components.spinner(statusBar);

    const jobs = dataStore('jobs');
    jobs.getData().number = (jobs.getData().number || 0) + 1;
    jobs.notify(false);

    var serverTask = new Task(`${ __dirname }/worker/server`);
    serverTask.on('server-ready', function() {
      console.log('Statwolf worker ready.');
      const client = clientFactory(serverTask);

      _components['push-manager'](client, _disposable);

      jobs.getData().number = jobs.getData().number - 1;
      jobs.notify(false);
    });
  },

  deactivate() {
    _disposable.dispose();
  }

};
