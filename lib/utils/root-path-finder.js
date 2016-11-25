'use babel'

import dataStore from './data-store';
import n from './notifications';
import path from 'safe-win-path';

export default function() {

  let basedir = atom.project.getDirectories().filter(function(item) {
    return item.path.match(/Statwolf$/) !== null;
  });

  if(basedir.length !== 1) {
    const online = dataStore('online');
    const onlineData = online.getData();

    onlineData.online = false;
    online.notify();

    n.error('Statwolf project error', 'Please add one (and only one) Statwolf project folder.');
    return;
  }

  return path.dirname(basedir[0].path);

};
