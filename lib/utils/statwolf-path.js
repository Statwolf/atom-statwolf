'use babel';

import path from 'path';
import rootPath from './root-path-finder';

export default function(hostPath) {

  let newPath = path.dirname(hostPath.replace(rootPath() + path.sep, ''));
  return newPath.replace(new RegExp('\\' + path.sep, 'g'), '.');

}
