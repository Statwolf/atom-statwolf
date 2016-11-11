'use babel';

import { CompositeDisposable } from 'atom';
import requireDir from 'require-dir';
import disposable from './utils/disposable';

const defaultDisposable = new CompositeDisposable();

const _components = requireDir('./components');

export default {

  activate(state) {
    _components.configurations(defaultDisposable);
    _components.templates(defaultDisposable);
    _components.path(defaultDisposable);
    _components['open-form']();
    _components.worker(_components);

    console.log('Statwolf plugin activated');
  },

  consumeStatusBar(statusBar) {
    _components['env-indicator'](statusBar);
    _components['status-indicator'](statusBar);
    _components.spinner(statusBar);
  },

  provideStatwolfCompletion() {
    return _components.autocompletion();
  },

  deactivate() {
    defaultDisposable.dispose();
    disposable.dispose();
  }

};
