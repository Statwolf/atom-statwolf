'use babel';

import { CompositeDisposable, Task } from 'atom';
import requireDir from 'require-dir';
import clientFactory from './worker/client';

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

    var serverTask = new Task(`${ __dirname }/worker/server`);
    serverTask.on('socket-ready', function(id) {
      console.log(`Statwolf worker ready. ID is ${ id }`);
      const client = clientFactory(id);

      _components['push-manager'](client, _disposable);
    });
  },

  deactivate() {
    _disposable.dispose();
  }

};
