'use babel';

import jobCounter from '../utils/job-counter';
import taboutTemplate from '../templates/taboutput';
import n from '../utils/notifications';

export default function(client, d) {

  const onCommandDispatched = function(command) {

    jobCounter.addJob();

    client.command('execute', {
      command
    }).then(function(data) {
      console.log(data);
    }).catch(function(error) {
      n.error('Statwolf console', error.message || `Syntax error in ${ error.filename } line ${ error.loc.line - 1 }`, true);
    }).then(function() {
      jobCounter.removeJob();
    });

  };

  const onExecute = atom.commands.add('atom-workspace', {
    'statwolf:execute': function(event) {
      const code = event.target.getModel().getText();

      onCommandDispatched(code);
    },
    'statwolf:executeTabOut': function(event) {
      const code = taboutTemplate(event.target.getModel().getText());

      onCommandDispatched(code);
    }
  });
  d.add(onExecute);

  console.log('Console ready.');

};
