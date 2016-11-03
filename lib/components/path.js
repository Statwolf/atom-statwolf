'use babel';

import resolver from '../utils/tree-path-resolver';
import path from 'path';
import rootPath from '../utils/root-path-finder';
import n from '../utils/notifications';
import fs from 'fs-plus';
import View from '../views/path';

export default function(d) {

  const onPath = atom.commands.add('atom-workspace', {
    'statwolf:copyPath': function(event) {
      const relativePath = resolver(event.target, true);

      atom.clipboard.write(relativePath.replace(new RegExp('\\' + path.sep, 'g'), '.'));
      n.info('Statwolf path', 'Path copied into clipboard');
    },
    'statwolf:openPath': function(event) {
      const view = new View();
      const panel = atom.workspace.addModalPanel({ item: view });

      view.on('exit', function() {
        panel.destroy();
      });

      view.on('confirm', function(statwolfPath) {
        panel.destroy();

        statwolfPath = statwolfPath.split('.');
        statwolfPath.push(statwolfPath[statwolfPath.length -1]);
        statwolfPath = statwolfPath.join(path.sep);
        statwolfPath = path.join(rootPath(), statwolfPath);

        if(fs.isFileSync(statwolfPath + '.js')) {
          statwolfPath = statwolfPath + '.js';
        }
        else if(fs.isFileSync(statwolfPath + '.json')) {
          statwolfPath = statwolfPath + '.json';
        }
        else {
          n.error('Statwolf path', 'Wrong path provided.');
          return;
        }

        console.log(statwolfPath);
        atom.workspace.open(statwolfPath);
      });
    }
  });
  d.add(onPath);

  console.log('Statwolf paths ready.');
};
