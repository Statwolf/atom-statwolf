'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';
import List from './debugger-list';
import Script from './debugger-script';
import Controls from './debugger-controls';
import Console from './debugger-console';
import Footer from './debugger-footer';
import dataStore from '../utils/data-store';

const store = dataStore('dbg-console'); 

export default class extends EventEmitter {

  constructor() {
    super();

    const onUpdate = (data) => {
      this.mode = data.mode || 'normal';
      this.update();
    }
    store.on('change', onUpdate);

    etch.initialize(this);
    onUpdate(store.getData());
  }

  getTitle() {
    return 'Statwolf Debugger';
  }

  off() {
    this.removeListener.apply(this, arguments);
  }

  render() {
    return <div tabIndex="-1" className="statwolf dbg-wrapper column">
      <div className="statwolf dbg-item big dbg-wrapper row" style={ this.mode === 'console-zen' ? 'display: none' : '' }>
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
      <Footer></Footer>
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
