'use babel';

import dataStore from '../utils/data-store';
import Indicator from '../views/status-indicator';

export default function(statusBar) {

  const online = dataStore('online');
  const setStatus = function(status) {
    const data = online.getData();

    data.online = status || !data.online;

    online.notify();
  };

  const view = new Indicator(online);
  view.on('toggle', function() {
    setStatus();
  });
  statusBar.addLeftTile({
    item: view,
    priority: 201
  });

  window.addEventListener('online', function() {
    setStatus(true)
  });
  window.addEventListener('offline', function() {
    setStatus(false);
  });

  console.log('Online indicator ready.');

}
