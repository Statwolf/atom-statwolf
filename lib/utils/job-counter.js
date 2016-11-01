'use babel';

import dataStore from './data-store';

const jobs = dataStore('jobs');

export default {

  addJob: function() {
    const data = jobs.getData();

    data.number = (data.number || 0) + 1;
    jobs.notify(false);
  },

  removeJob: function() {
    const data = jobs.getData();

    if(data.number === 0) {
      return;
    }

    data.number = data.number - 1;
    jobs.notify(false);
  }

};
