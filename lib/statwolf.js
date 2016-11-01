'use babel';

import { CompositeDisposable, Task } from 'atom';
import requireDir from 'require-dir';
import clientFactory from './worker/client';
import jobCounter from './utils/job-counter';

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

    jobCounter.addJob();

    var serverTask = new Task(`${ __dirname }/worker/server`);
    serverTask.on('server-ready', function() {
      console.log('Statwolf worker ready.');
      const client = clientFactory(serverTask);

      _components['push-manager'](client, _disposable);

      jobCounter.removeJob();
    });
  },

  deactivate() {
    _disposable.dispose();
  }

};
