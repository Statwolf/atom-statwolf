'use babel';

import EventEmitter from 'events';
import debouncer from './debouncer';

const store = {};

export default function(storeName) {

  if(typeof store[storeName] !== 'object') {

    const data = JSON.parse(localStorage.getItem(storeName)) || {};
    const item = store[storeName] = new EventEmitter();

    item.getData = function() {
      return data;
    };

    item.notify = function(save) {
      if(save == null) {
        save = true;
      }

      if(save) {
        localStorage.setItem(storeName, JSON.stringify(data));
      }

      this.emit('change', data);
    };

    const originalOn = item.on;
    item.on = function(name, handler) {
      const d = debouncer(handler);
      originalOn.call(item, name, d);

      return d;
    };

  }

  return store[storeName];

};
