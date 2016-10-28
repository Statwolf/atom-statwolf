'use babel';

import dataStore from '../utils/data-store';
import conf from '../utils/configurations';
import n from '../utils/notifications';
import rootPath from '../utils/root-path-finder';

export default function(client, d) {
  const jobs = dataStore('jobs');
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

    const jobData = jobs.getData();
    jobData.number = (jobData.number || 0) + 1;
    jobs.notify(false);

    const envData = env.getData().env;

    const payload = {
      userid: envData.userId,
      host: envData.host,
      port: envData.port,
      token: envData.token,
      changes,
      deleted,
      delete_all,
      basedir
    };

    client.command('push', payload).then(function(reply) {
      console.log(reply);
    }).catch(function(error) {
      console.log(error);
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

 console.log('Statwolf push ready.');
};
