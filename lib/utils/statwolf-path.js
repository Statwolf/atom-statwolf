'use babel';

import path from 'safe-win-path';
import rootPath from './root-path-finder';
import fs from 'fs';

const pathConverter = function(hostPath) {

  let newPath = hostPath.replace(rootPath() + path.sep, '');

  if(newPath.match(/.*(\.[a-zA-Z]+)+$/) !== null) {
    newPath = path.dirname(newPath);
  }

  return newPath.replace(new RegExp('\\' + path.sep, 'g'), '.');

}

const fileTypes = [
  'meta',
  'test',
  'deps',
  'template',
  'bindings',
  'spec'
];

const fileExtensions = {
  DashboardModel: 'json',
  Python: 'py',
  R: 'r',
  'C#': 'csx'
};

pathConverter.resolvePath = function(filePath, getExtension) {
  let customPath = filePath.split('.').slice(0, -1);

  let isNotMainFile = fileTypes.some(function(type) {
    return customPath[customPath.length - 1] === type;
  });

  if(isNotMainFile) {
    customPath = customPath.slice(0, -1);
  }

  if(getExtension === true) {
    let meta = JSON.parse(fs.readFileSync(customPath.concat([ 'meta', 'json' ]).join('.')));
    customPath.push(fileExtensions[meta.ComponentType] || fileExtensions[meta.ScriptLanguage] || 'js');
  }

  return customPath;
};

export default pathConverter;
