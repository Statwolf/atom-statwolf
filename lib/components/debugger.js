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
    const dbgConsole = dataStore('dbg-console');
    dbgConsole.getPosition = function(text) {
      const log = dbgConsole.getData().log || [];

      const position = {};
      const lastRow = log[log.length - 1] || { position: { end: -1 } };
      position.start = lastRow.position.end + 1;

      if(text != null) {
        position.end = position.start + text.split(/\r?\n/).length - 1;
      }

      return position;
    };

    let dbgr = null;
    const onCommand = function(command) {
      ((dbgr || {})[command] || function() {})();
    };
    dbgStatus.on('command', onCommand);

    dbgStatus.on('select-engine', function(id) {
      const data = dbgStatus.getData();

      if(id != null) {
        data.id = id;
        dbgr = client.dbgr(data.id);
      } else {
        data.id = null;
        data.stack = [];
        data.frame = -1;

        dbgr = null;
      }

      dbgStatus.notify(false);
    });

    dbgConsole.on('evaluate', function(code) {
      const data = dbgConsole.getData();
      data.log = data.log || [];
      data.log.push({ type: 'command', text: code, position: dbgConsole.getPosition(code) });

      if(dbgr == null) {
        data.log.push({ type: 'output', text: 'No debugger selected', position: dbgConsole.getPosition('No debugger selected') });
      } else {
        dbgr.evaluate(code, dbgStatus.getData().frame)
      }

      dbgConsole.notify(false);
    });

    dbgStatus.on('select-frame', function(frame) {
      dbgStatus.getData().frame = frame;
      dbgStatus.notify(false);
    });

    client.on('list', function(evt) {
      const data = debugInfo.getData();
      data.debuggers = evt.list;
      debugInfo.notify(false);

      let id = dbgStatus.getData().id;
      if(data.debuggers.indexOf(id) === -1) {
        id = data.debuggers[0];
      }
      dbgStatus.emit('select-engine', id);
    });

    client.on('status', function(evt) {
      const data = dbgStatus.getData();

      data.frame = evt.currentFrame;
      data.stack = evt.stack;

      dbgStatus.notify(false);
    });

    client.on('eval', function(reply) {
      const data = dbgConsole.getData();
      
      if(reply.exception) {
        data.log.push({ type: 'error', text: reply.exception, position: dbgConsole.getPosition(reply.exception) });
      } else {
        if(typeof(reply.result) === 'function') {
          reply.result = reply.result.toString();
        } else if(typeof(reply.result) !== 'string') {
          reply.result = JSON.stringify(reply.result);
        }

        data.log.push({ type: 'output', text: reply.result, position: dbgConsole.getPosition(reply.result) });
      }

      dbgConsole.notify(false);
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
