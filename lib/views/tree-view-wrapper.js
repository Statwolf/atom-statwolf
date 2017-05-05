'use babel'

import path from 'safe-win-path';

const workspace = atom.views.getView(atom.workspace);

const findTreeView = function() {
  atom.commands.dispatch(workspace, 'tree-view:show');

  let treeView;

  ['left', 'right'].some(function(position) {
    let item = atom.workspace.panelContainers[position].panels.find(function(item) {
      return item.item.constructor.name === 'TreeView';
    });

    if(item === undefined) {
      return false;
    }

    treeView = item;
    return true;
  });

  return treeView.item;
};

export default class {

  constructor() {}

  selectPath(selectedPath) {
    const treeView = findTreeView();

    const components = atom.project.relativizePath(selectedPath);
    let base = path.sanitize(components[0]);
    let entry;

    path.sanitize(components[1]).split(path.sep).forEach(function(token) {
      base += path.sep + token;

      entry = treeView.entryForPath(base);
      entry.expand();
    });

    treeView.selectEntry(entry);
    treeView.scrollToEntry(entry);
  }

}
