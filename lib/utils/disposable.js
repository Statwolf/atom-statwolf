'use babel';

import { CompositeDisposable } from 'atom';
import dataStore from '../utils/data-store';
import EventEmiter from 'events';

let callables = [];
let disposable = new CompositeDisposable();

const emitter = new EventEmiter();

const online = dataStore('online');
const onOnlineChange = function(store) {
  if(!store.online) {
    disposable.dispose();
    disposable = null;
    emitter.emit('dispose');
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

registry.on = function() {
  emitter.on.apply(emitter, arguments);
};

registry.once = function() {
  emitter.once.apply(emitter, arguments);
};

registry.removeListener = function() {
  emitter.removeListener.apply(emitter, arguments);
};

export default registry;
