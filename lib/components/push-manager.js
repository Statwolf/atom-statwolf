'use babel';

import fs from 'fs-plus';
import dataStore from '../utils/data-store';
import conf from '../utils/configurations';
import n from '../utils/notifications';
import rootPath from '../utils/root-path-finder';
import jobCounter from '../utils/job-counter';
import disposable from '../utils/disposable';
import path from 'path';

export default function(client) {
  const env = dataStore('env');
  const online = dataStore('online');
  const onlineData = online.getData();

  const doPush = function(changes, deleted, delete_all) {
    let basedir = rootPath();

    if(!basedir) {
      return;
    }

    const filterMatch = new RegExp(`^${basedir}`);
    changes = (changes || []).filter(function(path) {
      return path.match(filterMatch) != null;
    }).map(function(path) {
      return path.replace(filterMatch, '');
    });
    deleted = deleted || [];
    delete_all = delete_all || false;

    if(changes.length === 0 && deleted.length === 0) {
      console.log('No Statwolf project file to push.');
      return;
    }

    jobCounter.addJob();

    const payload = {
      changes,
      deleted,
      delete_all,
      basedir
    };

    const envName = env.getData().env.name;
    client.command('push', payload).then(function(reply) {
      n.info('Statwolf push', `${ Object.keys(reply).length } files pushed on ${ envName }`);
    }).catch(function(error) {
      console.log(error);
      n.error('Statwolf push', error.message || `Syntax error in ${ error.filename } line ${ error.loc.line - 1 }`, true);
    }).then(function() {
      jobCounter.removeJob();
    });

  };

  const onEditor = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      const path = editor.getPath();
      if(!path || !path.startsWith(rootPath())) {
        return;
      }

      const onSave = editor.onDidSave(function() {
        doPush([ path ]);
      });
      const onDestroy = editor.onDidDestroy(function() {
        onSave.dispose();
        onDestroy.dispose();
      });
    });
  };
  disposable(onEditor);

  const pushPaths = function(rootPath, deleteAll) {
    deleteAll = deleteAll || false;

    jobCounter.addJob();
 
    const changes = [];

    const onFile = function(file) {
      if(!fs.isFileSync(file)) {
        return;
      }

      changes.push(file);
    };

    const onDir = function() {
      return true;
    };

    const onDone = function() {
      jobCounter.removeJob();
      doPush(changes, [], deleteAll);
    };

    fs.traverseTree(rootPath, onFile, onDir, onDone);
  };

  const onPush = function() { 
    return atom.commands.add('atom-workspace', {
      'statwolf:pushLocation': function(event) {
        let target = event.target;

        if(target.nodeName !== 'SPAN') {
          target = target.querySelector('span');
        }

        let rootPath = target.getAttribute('data-path');
        if(rootPath.match(/.*(\.[a-zA-Z]+)+$/) !== null) {
          rootPath = path.dirname(rootPath);
        }

        pushPaths(rootPath);
      },
      'statwolf:pushProject': function() {
        const project = rootPath();
        if(!project) {
          return;
        }

        pushPaths(project, true);
      }
    });
  };
  disposable(onPush);

 console.log('Statwolf push ready.');
};
