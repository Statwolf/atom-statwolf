'use babel';

import path from 'safe-win-path';
import rootPath from './root-path-finder';

const pathConverter = function(hostPath) {

  let newPath = path.dirname(hostPath.replace(rootPath() + path.sep, ''));
  return newPath.replace(new RegExp('\\' + path.sep, 'g'), '.');

}

const fileTypes = [
  'meta',
  'test',
  'deps',
  'template',
  'spec'
];

const fileExtensions = {
  DashboardModel: 'json'
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
    let meta = require(customPath.concat([ 'meta', 'json' ]).join('.'));
    customPath.push(fileExtensions[meta.ComponentType] || 'js');
  }

  return customPath;
};

export default pathConverter;
