'use babel';

import fs from 'fs-plus';
import path from 'path';
import rootPath from '../utils/root-path-finder';

export default function() {
  const provider = {};

  provider.selector = '.source.js, .source.json';
  provider.inclusionPriority = 1;
  provider.excludeLowerPriority = false;
  provider.suggestionPriority = 2;

  provider.getSuggestions = function(options) {
    const row = options.editor.getTextInRange([[options.bufferPosition.row, 0], options.bufferPosition]).split(/[\"\'\ ]/g).pop();
    let match = row.match(/Statwolf\.[a-zA-Z0-9\-\_\.]*/g);
    if(!match) {
      return;
    }

    const root = rootPath();
    match = match.pop().split('.');
    const filter = match.pop();
    match.unshift(root);

    return new Promise(function(resolve, reject) {
      const results = [];
      const regexp = new RegExp('\\' + path.sep, 'g');
      const filterexp = new RegExp('.*\\.' + filter + '[a-zA-Z0-9\\-\\_\\.]*');

      const onDir = function(path) {
        results.push(path.replace(root, '').replace(regexp, '.'));
      };

      const onDone = function() {
        resolve(results.filter(function(item) {
          return item.match(filterexp) !== null;
        }).map(function(item) {
          item = item.replace('.', '');

          return {
            text: item.split('.').pop(),
            displayText: item,
            iconHTML: '<i class="icon-file-code" style="color: green"></i>'
          };
        }));
      };

      fs.traverseTree(match.join(path.sep), () => {}, onDir, onDone);
    });
  };

  console.log('Statwolf autocompletion ready.');

  return provider;
};
