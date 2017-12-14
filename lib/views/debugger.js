'use babel';

import electron from 'electron';
import EventEmitter from 'events';
import path from 'path';
import dataStore from '../utils/data-store';

export default function() {

  const emitter = new EventEmitter();

  const container = new electron.remote.BrowserWindow();
  container.on('close', function() {
    emitter.emit('close');
  });
  container.setMenu(null);
  container.setTitle('Statwolf Debugger');

  if(process.env.DEBUG_SW_DEBUGGER === "true") {
    container.webContents.openDevTools();
  }

  container.loadURL(path.join('file://', __dirname, '..', '..', 'debugger', 'index.html'));

  return emitter;

};
