'use babel';

import { CompositeDisposable } from 'atom';
import requireDir from 'require-dir';
import dataStore from './utils/data-store';
import disposable from './utils/disposable';

const defaultDisposable = new CompositeDisposable();

const _components = requireDir('./components');

export default {

  activate(state) {
    _components.configurations(defaultDisposable);
    _components.templates(defaultDisposable);
    _components.path(defaultDisposable);
    _components['open-form']();
    _components.worker(_components, defaultDisposable);

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
    const showViews = dataStore('showViews');
    showViews.getData().show = false;
    showViews.notify(false);

    defaultDisposable.dispose();
    disposable.dispose();
  }

};
