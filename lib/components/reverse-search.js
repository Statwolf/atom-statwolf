'use babel';

import resolver from '../utils/tree-path-resolver';
import dataStore from '../utils/data-store';
import rootPath from '../utils/root-path-finder';
import fs from 'fs-plus';
import swPath from '../utils/statwolf-path';
import n from '../utils/notifications';
import path from 'safe-win-path';
import jobCounter from '../utils/job-counter';
import View from '../views/reverse-search-results';

export default function(d) {

  const fileList = dataStore('fileList');
  const v = new View(d, fileList);

  const reverseSearchHandler = atom.commands.add('atom-workspace', {
    'statwolf:reverseSearch': function(event) {
      const fullPath = resolver(event.target);

      if(typeof(fullPath) !== 'string' || !fullPath.startsWith(rootPath())) {
        n.error('Statwolf reverse search', 'Not a statwolf module');
        return;
      }

      jobCounter.addJob();

      const match = new RegExp(`.*${ swPath(fullPath).replace(/\./g, '\\.') }.*`);
      console.log(match);

      const fileListData = fileList.getData()
      fileListData.list = [];
      fileList.notify();

      const onFile = function(file) {
        const text = fs.readFileSync(file, 'utf8');
        const result = text.match(match);
        if(result === null) {
          return;
        }

        file = path.sanitize(file);

        let fileType = file.match(/\.(meta|test|deps|template|bindings|spec)\./);
        fileType = fileType !== null ? fileType[0].replace(/\./g, '') : 'main';

        fileListData.list.push({
          path: swPath(file),
          matches: result,
          fileType
        });
        fileList.notify();
      };

      const onDir = function() {
        return true;
      };

      const onDone = function() {
        jobCounter.removeJob();
      };

      fs.traverseTree(path.join(rootPath(), 'Statwolf'), onFile, onDir, onDone);
    }
  });
  d.add(reverseSearchHandler);

  console.log('Reverse search ready.');
};
