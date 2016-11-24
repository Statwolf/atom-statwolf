'use babel';

import jobCounter from '../utils/job-counter';
import taboutTemplate from '../templates/taboutput';
import workerTemplate from '../templates/worker';
import n from '../utils/notifications';
import dataStore from '../utils/data-store';
import Console from '../views/console';
import disposable from '../utils/disposable';

export default function(client) {

  const output = dataStore('output');
  const outputData = output.getData();

  const view = new Console(output);

  const onCommandDispatched = function(command) {
    jobCounter.addJob();

    outputData.output = '';
    outputData.logs = [];
    output.notify(false);

    client.command('execute', {
      command
    }).then(function(data) {
      outputData.output = data.result;
      outputData.logs = data.logs || [];
      outputData.error = null;
      output.notify(false);
    }).catch(function(error) {
      outputData.output = null;
      outputData.logs = error.logs || [];
      outputData.error = error;
      output.notify(false);
    }).then(function() {
      jobCounter.removeJob();
    });

  };

  const onExecute = function() {
    return atom.commands.add('atom-workspace', {
      'statwolf:execute': function(event) {
        const code = event.target.getModel().getText();

        onCommandDispatched(code);
      },
      'statwolf:executeInWorker': function(event) {
        const code = workerTemplate(event.target.getModel().getText());

        onCommandDispatched(code);
      },
      'statwolf:executeTabOut': function(event) {
        const code = taboutTemplate(event.target.getModel().getText());

        onCommandDispatched(code);
      }
    });
  };
  disposable(onExecute);

  console.log('Console ready.');

};
