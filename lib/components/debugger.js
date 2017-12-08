'use babel';

import view from '../views/debugger'

export default function(d) {

  let _debugger = null;

  const command = atom.commands.add('atom-workspace', {
    'statwolf:debugger': function() {
      if(_debugger != null) {
        return;
      }

      _debugger = view();
      _debugger.on('close', function() {
        _debugger = null;
      });
    }
  });

};
