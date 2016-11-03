'use babel';

import path from 'path';
import rootPath from '../utils/root-path-finder';

export default function(target, relative) {
  if(target.nodeName !== 'SPAN') {
    target = target.querySelector('span');
  }

  let resourcePath = target.getAttribute('data-path');
  if(resourcePath.match(/.*(\.[a-zA-Z]+)+$/) !== null) {
    resourcePath = path.dirname(resourcePath);
  }

  if(relative) {
    resourcePath = resourcePath.replace(rootPath() + path.sep, '');
  }

  return resourcePath;
};
