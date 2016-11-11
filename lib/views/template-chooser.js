'use babel';

/**
 * N.W. This view uses atom-space-pen-views that should be deprecated.
 * Right now does'not exist any implementation of the Selectlistview leveraging on the etch framework.
 * In the future, maybe, we have to rewrite this module by using components.
 **/

import { SelectListView } from 'atom-space-pen-views';
import EventEmitter from 'events';
import rootPath from '../utils/root-path-finder';
import path from '../utils/safe-path';
import fs from 'fs-plus';

const ee = new EventEmitter();

export default class extends SelectListView {

  constructor() {
    super();

    templatePath = path.join(rootPath(), 'Statwolf', 'Templates');

    const templateList = [];

    const onDir = function(dir) {
      dir = path.sanitize(dir);

      templateList.push({
        label: path.basename(dir).replace(/([A-Z])/g, ' $1').replace(/^./, (c) => { return c.toUpperCase() }),
        dir
      });

      return false;
    };

    const onDone = () => {
      this.setItems(templateList);
      this.focusFilterEditor();
    };

    fs.traverseTree(templatePath, () => {}, onDir, onDone);
  }

  getFilterKey() {
    return  'label';
  }

  viewForItem(item) {
    return `<li>${item.label}</li>`
  }

  on() {
    ee.on.apply(ee, arguments);
  }

  once() {
    ee.once.apply(ee, arguments);
  }

  emit() {
    ee.emit.apply(ee, arguments);
  }

  cancel() {
    ee.emit('exit');
  }

  confirmed(item) {
    ee.emit('confirm', item);
  }

}
