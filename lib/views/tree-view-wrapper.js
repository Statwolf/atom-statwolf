'use babel'

import path from 'path';

const workspace = atom.views.getView(atom.workspace);

const findTreeView = function() {
  atom.commands.dispatch(workspace, 'tree-view:show');

  let treeView;

  let items = [];
  ['left', 'right'].forEach(function(position) {
    items = items.concat(atom.workspace.panelContainers[position].panels.map(function(p) { return p.item }));
    if(atom.workspace.panelContainers[position].dock !== undefined) {
      items = items.concat(atom.workspace.panelContainers[position].dock.getPaneItems())
    }
  });

  items.some(function(item) {
    if(item.constructor.name === 'TreeView') {
      treeView = item;
      return true;
    }

    return false;
  });

  return treeView;
};

export default class {

  constructor() {}

  selectPath(selectedPath) {
    const treeView = findTreeView();

    const components = atom.project.relativizePath(selectedPath);
    let base = components[0];

    components[1].split(path.sep).forEach(function(token) {
      console.log(base);

      const entry = treeView.entryForPath(base);
      entry.expand();

      base += path.sep + token;
    });

    const entry = treeView.entryForPath(base);
    entry.expand();
    treeView.selectEntry(entry);
    treeView.scrollToEntry(entry);
  }

}
