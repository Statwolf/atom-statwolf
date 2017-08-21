'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import dataStore from '../utils/data-store';

const store = dataStore('dbg-status');

export default class {

  constructor() {
    const onSelection = (data) => {
      this.disabled = data.id == null ? 'disabled' : '';

      this.update();
    };
    store.on('change', onSelection);

    etch.initialize(this);
    onSelection(store.getData());
  }

  render() {
    return <div className="statwolf toolbar">
      <span title="Continue" onclick={ () => { store.emit('command', 'continue'); } } className={ "icon icon-zap " + this.disabled }></span>
      <span title="Next" onclick={ () => { store.emit('command', 'stepNext'); } } className={ "icon icon-chevron-right " + this.disabled }></span>
      <span title="Step In" onclick={ () => { store.emit('command', 'stepIn'); } } className={ "icon icon-cloud-download " + this.disabled }></span>
      <span title="Step Out" onclick={ () => { store.emit('command', 'stepOut'); } } className={ "icon icon-cloud-upload " + this.disabled }></span>
    </div>
  }

  update() {
    etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
