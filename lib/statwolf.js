'use babel';

import { CompositeDisposable, Task } from 'atom';
import requireDir from 'require-dir';
import clientFactory from './worker/client';
import jobCounter from './utils/job-counter';
import disposable from './utils/disposable';

const defaultDisposable = new CompositeDisposable();

const _components = requireDir('./components');

export default {

  activate(state) {
    _components.configurations(defaultDisposable);

    console.log('Statwolf plugin activated');
  },

  consumeStatusBar(statusBar) {
    _components['env-indicator'](statusBar);
    _components['status-indicator'](statusBar);
    _components.spinner(statusBar);

    jobCounter.addJob();

    var serverTask = new Task(`${ __dirname }/worker/server`);
    serverTask.on('server-ready', function() {
      console.log('Statwolf worker ready.');
      const client = clientFactory(serverTask);

      _components['push-manager'](client);
      _components.console(client);

      jobCounter.removeJob();
    });
  },

  deactivate() {
    defaultDisposable.dispose();
    disposable.dispose();
  }

};
