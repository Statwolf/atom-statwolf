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
import swPath from '../utils/statwolf-path';
import textEditor from '../utils/text-editor-resolver';

export default function(client) {

  const output = dataStore('output');

  const view = new Console(output);

  const onCommandDispatched = function(command) {
    jobCounter.addJob();
    const outputData = output.getData();

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
    const executeTest = function(editor, template) {
      template = template || function(code) {
        return code;
      };

      let mainPath = editor.getPath();

      if(!mainPath) {
        return;
      }

      const onSaved = function() {
        mainPath = path.sanitize(mainPath);
        mainPath = mainPath.split(path.sep);
        let filename = `${ mainPath.pop().split('.').shift() }.test.js`;
        mainPath.push(filename);
        mainPath = mainPath.join(path.sep);

        fs.readFile(mainPath, 'utf8', function(error, code) {
          if(error) {
            console.log(error);
            return;
          }

          code = template(code);

          onCommandDispatched(code);
        });
      };

      if(editor.isModified()) {
        const internalPath = swPath(editor.getPath());
        const onPushed = function(error, data) {
          if(data && !data[internalPath]) {
            return;
          }
          client.removeListener('push', onPushed);

          if(error) {
            console.log(error);
            return;
          }

          onSaved();
        };
        client.on('push', onPushed);
        editor.save();
      } else {
        onSaved();
      }
    };

    return atom.commands.add('atom-workspace', {
      'statwolf:execute': function(event) {
        const code = textEditor(event).getText();

        onCommandDispatched(code);
      },
      'statwolf:executeTest': function(event) {
        executeTest(textEditor(event));
      },
      'statwolf:executeTestInWorker': function(event) {
        executeTest(textEditor(event), workerTemplate);
      },
      'statwolf:executeInWorker': function(event) {
        const code = workerTemplate(textEditor(event).getText());

        onCommandDispatched(code);
      },
      'statwolf:executeTestTabOut': function(event) {
        executeTest(textEditor(event), taboutTemplate);
      },
      'statwolf:executeTabOut': function(event) {
        const code = taboutTemplate(textEditor(event).getText());

        onCommandDispatched(code);
      }
    });
  };
  disposable(onExecute);

  console.log('Console ready.');

};
