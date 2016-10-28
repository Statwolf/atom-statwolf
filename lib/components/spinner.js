'use babel';

import dataStore from '../utils/data-store';
import Spinner from '../views/spinner';

export default function(statusBar) {

  const jobs = dataStore('jobs');
  const spinner = new Spinner(jobs);
  statusBar.addRightTile({
    item: spinner,
    priority: 200
  });

  console.log('Statwolf spinner ready.');

};
