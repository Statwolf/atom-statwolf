'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';
import List from './debugger-list';
import Script from './debugger-script';
import Controls from './debugger-controls';
import Console from './debugger-console';

export default class extends EventEmitter {

  constructor() {
    super();

    etch.initialize(this);
  }

  getTitle() {
    return 'Statwolf Debugger';
  }

  off() {
    this.removeListener.apply(this, arguments);
  }

  render() {
    return <div className="statwolf dbg-wrapper column">
      <div className="statwolf dbg-item big dbg-wrapper row">
        <div className="statwolf dbg-item smaller dbg-wrapper column">
          <div className="statwolf dbg-item smaller"><Controls></Controls></div>
          <div className="statwolf dbg-item biggest"><List className="statwolf"></List></div>
        </div>
        <div className="statwolf dbg-item big dbg-editor-wrapper">
          <Script></Script>
        </div>
      </div>
      <div className="statwolf dbg-item smaller dbg-wrapper row">
        <div className="statwolf dbg-item bigger">
          <Console></Console>
        </div>
      </div>
    </div>;
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    this.emit('close');
    await etch.destroy(this);
  }

}
