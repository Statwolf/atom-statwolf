'use babel'

const path = require('path');
const platform = process.platform;
const user = process.env.USER || process.env.USERNAME;

let userFolder;

switch(platform) {
  case 'linux':
    userFolder = path.join(path.sep, 'home', user);
    break;
  case 'win32':
  case 'windows':
    userFolder = path.join('C:', 'Users', user);
    break;
  case 'darwin':
    userFolder = path.join(path.sep, 'Users', user);
    break;
}

const atomFolder = atom.getConfigDirPath();
const statwolfFolder = path.join(userFolder, 'statwolf');

module.exports = {
  rootPath: statwolfFolder,
  historyLocation: path.join(atomFolder, 'sw-console-history'),
  logLocation: path.join(atomFolder, 'swLogWeb.log'),
  externalTemplateDir: path.join(statwolfFolder, 'Statwolf', 'Templates'),
  environments: [{
    name: 'test',
    host: 'http://127.0.0.1',
    port: 8080,
    userId: 'statwolf',
    token: 'test123',
    color: 'green'
  }, {
    name: 'production',
    host: 'http://127.0.0.1',
    port: 8080,
    userId: 'boss',
    token: 'test123',
    color: 'red'
  }],
  enableLogToFile: true,
  enableLogInDevConsole: true,
  logAddress: '127.0.0.1',
  logPort: 2300,
  maxHistorySize: 1000,
  caseSensitiveAutoCompletion: false,
  createFileInstantly: true,
  openExtraPanel: false,
  doubleClickNavigation: true
};
