const TabGroup = require('electron-tabs');

const _tabs = new TabGroup();
const _store = {};

module.exports = function(opts) {
  const key = `${ opts.src }::${ opts.title }`;

  if(_store[key] == null) {
    const tab = _store[key] = _tabs.addTab(opts);

    tab.on('close', function() {
      delete _store[key];
    });
  }

  _store[key].activate();
};
