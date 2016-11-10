'use babel';

import disposable from '../utils/disposable';
import dataStore from '../utils/data-store';
import rootPath from '../utils/root-path-finder';
import swPath from '../utils/statwolf-path';
import n from '../utils/notifications';
import { shell } from 'electron';

export default function() {

  const env = dataStore('env');

  const onEditor = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      let path = editor.getPath();
      if(!path || !path.startsWith(rootPath())) {
        return;
      }

      let info;
      metaPath = path.split('.').slice(0, 1).concat([ 'meta', 'json' ]).join('.');
      try {
        info = require(metaPath);
      } catch(e) {
        return;
      }

      if(info.ComponentType !== 'DashboardForm') {
        return;
      }

      editor.element.onkeydown = function(e) {
        if(!e.altKey || !e.ctrlKey || e.code !== 'KeyG') {
          return;
        }

        const current = env.getData().env;
        const url = `${ current.host }:${ current.port }/Toolbox/Dashboard/ViewForm.aspx?formContext=${ swPath(path) }`;
        
        shell.openExternal(url);

        n.info('Statwolf form', 'The form is now opened in your browser');
      };
    });
  };
  disposable(onEditor);

  console.log('Form opener ready');
};
