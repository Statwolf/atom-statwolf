'use babel';

import fs from 'fs-plus';
import dataStore from '../utils/data-store';
import conf from '../utils/configurations';
import n from '../utils/notifications';
import rootPath from '../utils/root-path-finder';

export default function(client, d) {
  const jobs = dataStore('jobs');
  const env = dataStore('env');
  const envData = env.getData();
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

    const jobData = jobs.getData();
    jobData.number = (jobData.number || 0) + 1;
    jobs.notify(false);

    const env = envData.env;

    const payload = {
      userid: env.userId,
      host: env.host,
      port: env.port,
      token: env.token,
      changes,
      deleted,
      delete_all,
      basedir
    };

    client.command('push', payload).then(function(reply) {
      n.info('Statwolf push', `${ Object.keys(reply).length } files pushed on ${ env.name }`);
    }).catch(function(error) {
      console.log(error);
      n.error('Statwolf push', error.message || `Syntax error in ${ error.filename } line ${ error.loc.line - 1 }`, true);
    }).then(function() {
      if(jobData.number === 0) return;

      jobData.number = jobData.number - 1;
      jobs.notify(false);
    });

  };

  const onSave = atom.commands.onDidDispatch(function(event) {
    if(!onlineData.online || event.type !== 'core:save' || !event.target.model.editorElement || !event.target.model.getPath()) {
      return;
    }

    doPush([ event.target.model.getPath() ])
  });
  d.add(onSave);
  const onPushAll = atom.commands.add('atom-workspace', {
    'statwolf:pushProject': function() {
      if(!onlineData.online) {
        return;
      }

      const project = rootPath();
      if(!project) {
        return;
      }

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
        doPush(changes, [], true);
      };

      fs.traverseTree(project, onFile, onDir, onDone);
    }
  })

 console.log('Statwolf push ready.');
};
