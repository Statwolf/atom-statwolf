'use babel';

import disposable from '../utils/disposable';
import dataStore from '../utils/data-store';
import rootPath from '../utils/root-path-finder';
import swPath from '../utils/statwolf-path';
import path from 'safe-win-path';
import n from '../utils/notifications';
import { shell } from 'electron';

const metaKey = process.platform === 'darwin' ? 'metaKey' : 'ctrlKey';

export default function() {

  const env = dataStore('env');

  const onEditor = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      let filePath = editor.getPath();

      if(!filePath) {
        return;
      }

      filePath = path.sanitize(filePath);
      if(!filePath.startsWith(rootPath())) {
        return;
      }

      let info;
      metaPath = filePath.split('.').slice(0, -1).concat([ 'meta', 'json' ]).join('.');

      try {
        info = require(metaPath);
      } catch(e) {
        return;
      }

      if(info.ComponentType !== 'DashboardForm') {
        return;
      }

      editor.element.onkeydown = function(e) {
        if(!e.altKey || !e[metaKey] || e.code !== 'KeyG') {
          return;
        }

        const current = env.getData().env;
        const url = `${ current.host }:${ current.port }/Toolbox/Dashboard/ViewForm.aspx?formContext=${ swPath(filePath) }`;

        shell.openExternal(url);

        n.info('Statwolf form', 'The form is now open in your browser');
      };

    });
  };
  disposable(onEditor);

  console.log('Form opener ready');
};
