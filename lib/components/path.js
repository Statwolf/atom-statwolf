'use babel';

import resolver from '../utils/tree-path-resolver';
import path from 'safe-win-path';
import rootPath from '../utils/root-path-finder';
import n from '../utils/notifications';
import fs from 'fs-plus';
import View from '../views/modal-text';
import swPath from '../utils/statwolf-path';

const open = function(statwolfPath) {
  statwolfPath = statwolfPath.replace(/^statwolf:\/\//, '');

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
    throw new Error('Wrong path provided');
    //return;
  }

  return atom.workspace.open(statwolfPath);

};

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

        open(statwolfPath);
      });
    }
  });
  d.add(onPath);

  const clickHandler = atom.workspace.observeTextEditors(function(editor) {
    const view = editor.element;

    view.addEventListener('dblclick', function(event) {

      if(!event.ctrlKey) {
        return;
      }

      const cursor = editor.getCursorBufferPosition();
      const row = editor.getTextInRange([ [ cursor.row, 0 ], [ cursor.row, Infinity ] ]);
      const text = row.match(/Statwolf\.([a-zA-Z0-9\_\-]+\.?)*/g);

      if(!text) {
        return;
      }

      let distance = Infinity;
      let currentPath;
      text.forEach(function(match) {
        const d = cursor.column - row.indexOf(match);
        if(d < 0 || d >= distance) {
          return;
        }

        distance = d;
        currentPath = match;
      });

      console.log(`Opening ${ currentPath }`);
      open(currentPath);
    });

  });
  d.add(clickHandler);

  const componentHandler = atom.workspace.observeTextEditors(function(editor) {
    let filePath = editor.getPath();

    if(!filePath) {
      return;
    }

    filePath = path.sanitize(filePath);

    if(!filePath.startsWith(rootPath())) {
      return;
    }

    const view = editor.element;
    let customPath;

    view.addEventListener('keydown', function(event) {

      if(!event.ctrlKey || !event.altKey) {
        return;
      }

      switch(event.code) {
        case 'Digit8':
          customPath = swPath.resolvePath(filePath).concat([ 'js' ]).join('.');
          break;
        case 'Digit9':
          customPath = swPath.resolvePath(filePath).concat([ 'test', 'js' ]).join('.');
          break;
        case 'Digit0':
          customPath = swPath.resolvePath(filePath).concat([ 'deps', 'json' ]).join('.');
          break;
        default:
          return;
      }

      if(!fs.existsSync(customPath)) {
        return;
      }

      atom.workspace.open(customPath);
    });

  });
  d.add(componentHandler);

  const externalHandler = atom.workspace.addOpener(function(uri) {
    if(!uri.startsWith('statwolf://Statwolf.')) {
      return;
    }

    return open(uri);
  });
  d.add(externalHandler);

  console.log('Statwolf paths ready.');
};
