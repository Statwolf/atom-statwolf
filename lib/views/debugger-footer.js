'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import dataStore from '../utils/data-store';

export default class {

  constructor() {
    etch.initialize(this);
  }

  render() {
    return <div className="statwolf footer">
      <span onclick={ () => { this.reset() } } title="Reset debugger" className="icon icon-plug"></span>
    </div>
  }

  reset() {
    const s = dataStore('dbg-status');
    s.emit('reset');
  }

  update() {
    etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
