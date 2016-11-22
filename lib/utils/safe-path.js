'use babel';

import pathModule from 'path';

const service = {};

service.sanitize = function(path) {
  return path.replace(/\\/g, '/');
};

service.join = function() {
  return Array.from(arguments).map(function(arg) {
    return service.sanitize(arg);
  }).join('/');
};

service.dirname = function(path) {
  return service.sanitize(pathModule.dirname(path));
};

service.basename = function(path) {
  return service.sanitize(pathModule.basename(path));
};

service.sep = '/';

export default service;
