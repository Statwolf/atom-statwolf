'use babel';

import path from 'path';
import rootPath from '../utils/root-path-finder';

export default function(target, relative) {
  if(target.getAttribute('data-path') === null) {
    target = target.querySelector('[data-path]');
  }

  if(target === null) {
    return null;
  }

  let resourcePath = target.getAttribute('data-path');

  if(!resourcePath.startsWith(rootPath())) {
    return null;
  }

  if(resourcePath.match(/.*(\.[a-zA-Z]+)+$/) !== null) {
    resourcePath = path.dirname(resourcePath);
  }

  if(relative) {
    resourcePath = resourcePath.replace(rootPath() + path.sep, '');
  }

  return resourcePath;
};
