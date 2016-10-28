'use babel';

import dataStore from '../utils/data-store';
import Indicator from '../views/env-indicator';

export default function(statusBar) {
  const env = dataStore('env');
  const online = dataStore('online');

  const view = new Indicator(env, online);
  view.on('toggle-env', function() {
    const data = env.getData();

    data.index = (data.index + 1) % data.list.length;
    data.env = data.list[data.index];

    env.notify();
  });
  statusBar.addLeftTile({
    item: view,
    priority: 200
  });

  console.log('Env indicator ready.');

};
