'use babel';

import fs from 'fs-plus';
import dataStore from '../utils/data-store';
import conf from '../utils/configurations';
import n from '../utils/notifications';
import rootPath from '../utils/root-path-finder';
import jobCounter from '../utils/job-counter';
import disposable from '../utils/disposable';
import path from 'safe-win-path';
import resolver from '../utils/tree-path-resolver';

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
    changes = (changes || []).filter(function(filePath) {
      return filePath.match(filterMatch) != null;
    }).map(function(filePath) {
      return filePath.replace(filterMatch, '');
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
      let filePath = editor.getPath();

      if(!filePath) {
        return;
      }

      filePath = path.sanitize(filePath);
      if(!filePath.startsWith(rootPath())) {
        return;
      }

      const onSave = editor.onDidSave(function() {
        doPush([ filePath ]);
      });
      const destroy = function() {
        onSave.dispose();
        onDestroy.dispose();
        disposable.removeListener('dispose', destroy);
      };
      const onDestroy = editor.onDidDestroy(destroy);
      disposable.on('dispose', destroy);
    });
  };
  disposable(onEditor);

  const pushPaths = function(rootPath, deleteAll) {
    deleteAll = deleteAll || false;

    jobCounter.addJob();

    const changes = [];

    const onFile = function(file) {
      file = path.sanitize(file);

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
        pushPaths(resolver(event.target));
      },
      'statwolf:pushProject': function() {
        const project = rootPath();
        if(!project) {
          return;
        }

        console.log(project);
        pushPaths(project, true);
      }
    });
  };
  disposable(onPush);

 console.log('Statwolf push ready.');
};
