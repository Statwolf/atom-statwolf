'use babel';

import conf from '../utils/configurations';
import dataStore from '../utils/data-store';
import n from '../utils/notifications';

export default function(d) {

  const command = atom.commands.add('atom-workspace', {
    'statwolf:openConfigurationFile': function() {
      atom.workspace.open(conf.getLocation());
    }
  });
  d.add(command);

  const onChange = function(newConf) {
    const env = dataStore('env');

    const data = env.getData();

    if(!Array.isArray(newConf.environments) || newConf.environments.length === 0) {
      data.index = 0;
      data.list = [];
      data.env = {};

      n.error('No statwolf environment found', 'Please add at least one Statwolf environment into the sw-config file');
      env.notify();

      return;
    }

    data.index = data.index || 0;
    data.index = data.index >= newConf.environments.length ? 0 : data.index;

    data.list = newConf.environments;

    data.env = newConf.environments[data.index];

    env.notify();
  };

  conf.on('change', onChange);
  onChange(conf);

  console.log('Statwolf configurations ready.');

};
