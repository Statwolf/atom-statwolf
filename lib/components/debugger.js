'use babel';

import View from '../views/debugger';
import clientFactory from 'statwolf-debugger-client';
import dataStore from '../utils/data-store';

const DEBUGGER_NAME = 'statwolf://debugger';
const DEBUGGER_PATH = 'statwolf:/debugger';
const DEBUGGER_PATH_WIN = 'statwolf:\\debugger';

export default function(d) {

  const env = dataStore('env');
  const debugInfo = dataStore('debug');

  let view = null;
  let client = null;

  const cleanup = function() {
    client.close();
    client = null;
  }

  const connect = function(data) {
    if(client != null) {
      cleanup();
    }

    client = clientFactory(`${ data.env.host.replace(/^https?/, 'ws') }:9999`);

    const dbgStatus = dataStore('dbg-status');
    dbgStatus.on('enable', function(id) {
      const d = client.dbgr(id);

      dbgStatus.getData().id = id;
      dbgStatus.notify(false);
    });

    dbgStatus.on('select', function(frame) {
      dbgStatus.getData().frame = frame;
      dbgStatus.notify(false);
    });

    client.on('list', function(evt) {
      debugInfo.getData().debuggers = evt.list;
      debugInfo.notify(false);

      const status = dbgStatus.getData();
      status.id = null;
      status.stack = [];
      status.current = -1;

      dbgStatus.notify(false);
    });

    client.on('status', function(evt) {
      const data = dbgStatus.getData();

      data.frame = evt.currentFrame;
      data.stack = evt.stack;

      dbgStatus.notify(false);
    });
  };
  env.on('change', connect);

  const debuggerOpener = atom.workspace.addOpener(function(path) {
    if (path !== DEBUGGER_NAME && path !== DEBUGGER_PATH && path !== DEBUGGER_PATH_WIN) {
      return;
    }

    if (view !== null) {
      return view;
    }

    connect(env.getData());

    view = new View();
    view.on('close', function() {
      console.log('Cleaning debugger');
      view = null;
      cleanup();
    });
    return view;
  });
  d.add(debuggerOpener);

  const onDebugger = atom.commands.add('atom-workspace', {
    'statwolf:debugger': function() {
      return atom.workspace.open(DEBUGGER_NAME);
    }
  });
  d.add(onDebugger);

}
