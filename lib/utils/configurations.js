'use babel';

import path from 'path';
import fs from 'fs';
import n from '../utils/notifications';
import configFileTemplate from '../templates/sw-config';
import EventEmitter from 'events';
import util from 'util';

const _configFileLocation = path.join(atom.getConfigDirPath(), 'sw-config.json');

let _conf;
let _emitter = new EventEmitter();
let _watcher;

const _loadConfig = function(evt) {
  try {
    _conf = JSON.parse(fs.readFileSync(_configFileLocation));
    _emitter.emit('change', _conf);
  } catch(e) {
    if(e instanceof SyntaxError) {
      console.log(e);
      n.error('Invalid Statwolf configuration file', 'Please check your configuration file. You can open it from the Statwolf menu.', true);
    }
    else {
      fs.writeFileSync(_configFileLocation, JSON.stringify(configFileTemplate, null, 1));
      _conf = Object.assign({}, configFileTemplate);
      _emitter.emit('change', _conf);
      n.info('New Statwolf configuration file', 'A new configuration file was placed in your home directory.');
    }
  }

  _conf.on = function() {
    _emitter.on.apply(_emitter, arguments);
  };
  _conf.getLocation = function() {
    return _configFileLocation;
  };

  if(evt === 'rename') {
    if(_watcher) {
      _watcher.close();
    }
    _watcher = fs.watch(_configFileLocation, _loadConfig);
  }

};

_loadConfig('rename');

export default _conf;
