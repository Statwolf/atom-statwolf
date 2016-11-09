'use babel';

import resolver from '../utils/tree-path-resolver';
import path from 'path';
import rootPath from '../utils/root-path-finder';
import n from '../utils/notifications';
import fs from 'fs-plus';
import View from '../views/modal-text';

export default function(d) {

  const onPath = atom.commands.add('atom-workspace', {
    'statwolf:copyPath': function(event) {
      const relativePath = resolver(event.target, true);

      if(relativePath === null) {
        n.error('Statwolf path', 'Not a Statwolf module', true);
        return;
      }

      atom.clipboard.write(relativePath.replace(new RegExp('\\' + path.sep, 'g'), '.'));
      n.info('Statwolf path', 'Path copied into clipboard');
    },
    'statwolf:openPath': function(event) {
      const view = new View('Insert a Statwolf path');
      const panel = atom.workspace.addModalPanel({ item: view });

      view.on('exit', function() {
        panel.destroy();
      });

      view.on('confirm', function(statwolfPath) {
        view.emit('exit');

        statwolfPath = statwolfPath.split('.');
        statwolfPath.push(statwolfPath[statwolfPath.length -1]);
        statwolfPath = statwolfPath.join(path.sep);
        statwolfPath = path.join(rootPath(), statwolfPath);

        var exists = ['.js', '.json', '.r', '.py', '.csx'].some(function(suffix) {
          if(!fs.isFileSync(statwolfPath + suffix)) return false;

          statwolfPath = statwolfPath + suffix;
          return true;
        });

        if(!exists) {
          n.error('Statwolf path', 'Wrong path provided.');
          return;
        }

        atom.workspace.open(statwolfPath);
      });
    }
  });
  d.add(onPath);

  console.log('Statwolf paths ready.');
};
