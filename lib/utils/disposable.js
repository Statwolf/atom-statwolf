'use babel';

import { CompositeDisposable } from 'atom';
import dataStore from '../utils/data-store';

const callables = [];
let disposable = new CompositeDisposable();

const online = dataStore('online');
const onOnlineChange = function(store) {
  if(!store.online) {
    disposable.dispose();
    disposable = null;
    return;
  }

  if(!disposable) {
    disposable = new CompositeDisposable();
  }
  callables.forEach(function(callable) {
    disposable.add(callable());
  });
};
online.on('change', onOnlineChange);

const registry = function(callable) {
  callables.push(callable);

  if(online.getData().online) {
    disposable.add(callable());
  }
};

registry.dispose = function() {
  onOnlineChange({ online: false });
};

export default registry;
