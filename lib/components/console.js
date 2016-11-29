'use babel';

import jobCounter from '../utils/job-counter';
import taboutTemplate from '../templates/taboutput';
import workerTemplate from '../templates/worker';
import n from '../utils/notifications';
import dataStore from '../utils/data-store';
import Console from '../views/console';
import disposable from '../utils/disposable';
import path from 'safe-win-path';
import fs from 'fs';

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
    const getTestFilePath = function(mainPath) {
      mainPath = path.sanitize(mainPath);
      mainPath = mainPath.split(path.sep);
      let filename = `${ mainPath.pop().split('.').shift() }.test.js`;
      mainPath.push(filename);
      mainPath = mainPath.join(path.sep);

      return mainPath;
    };

    return atom.commands.add('atom-workspace', {
      'statwolf:execute': function(event) {
        const code = event.target.getModel().getText();

        onCommandDispatched(code);
      },
      'statwolf:executeTest': function(event) {
        let mainPath = event.target.getModel().getPath();

        if(!mainPath) {
          return;
        }

        mainPath = getTestFilePath(mainPath);

        fs.readFile(mainPath, 'utf8', function(error, code) {
          if(error) {
            return;
          }

          onCommandDispatched(code);
        });
      },
      'statwolf:executeTestInWorker': function(event) {
        let mainPath = event.target.getModel().getPath();

        if(!mainPath) {
          return;
        }

        mainPath = getTestFilePath(mainPath);

        fs.readFile(mainPath, 'utf8', function(error, code) {
          if(error) {
            return;
          }

          code = workerTemplate(code);
          onCommandDispatched(code);
        });
      },
      'statwolf:executeInWorker': function(event) {
        const code = workerTemplate(event.target.getModel().getText());

        onCommandDispatched(code);
      },
      'statwolf:executeTestTabOut': function(event) {
        let mainPath = event.target.getModel().getPath();

        if(!mainPath) {
          return;
        }

        mainPath = getTestFilePath(mainPath);

        fs.readFile(mainPath, 'utf8', function(error, code) {
          if(error) {
            return;
          }

          code = taboutTemplate(code);
          onCommandDispatched(code);
        });
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
