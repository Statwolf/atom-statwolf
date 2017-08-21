'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import dataStore from '../utils/data-store';

const store = dataStore('dbg-status');

export default class {

  constructor(props) {
    this.id = props.did;
    const update = (data) => {
      if(data.id !== this.id) {
        this.stack = [];
        this.current = -1;
        this.currentDebugger = data.id;

        this.update({ did: this.id });
        return;
      }

      this.stack = data.stack;
      this.current = data.frame;
      this.currentDebugger = data.id;

      this.update({ did: this.id });
    };
    store.on('change', update);

    etch.initialize(this);
    update(store.getData());
  }

  render() {
    const frames = (this.stack || []).map((info, index) => {
      return <li className={ this.current === index ? 'statwolf link selected ' : 'statwolf link' } onclick={ (evt) => { store.emit('select-frame', index); evt.stopPropagation(); } }><span>{ info.name || 'anonymous' } ({ info.line + 1 }:{ info.column + 1 })</span></li>;
    });

    return <li className={ this.id === this.currentDebugger ? 'statwolf link selected ' : 'statwolf link' } onclick={ () => { store.emit('select-engine', this.id); } }><span className="statwolf icon icon-circuit-board"></span> { this.id }<ul>{ frames }</ul></li>
  }

  update(props) {
    this.id = props.did;

    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
