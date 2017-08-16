'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import dataStore from '../utils/data-store';
import Debugger from './debugger-element';

export default class {
  
  constructor() {
    const info = dataStore('debug');
    const onList = (data) => {
      this.list = data.debuggers;

      this.update();
    };
    info.on('change', onList);

    etch.initialize(this);
    onList(info.getData());
  }

  render() {
    const list = (this.list || []).map(function(d) {
      return <Debugger did={ d }></Debugger>
    });

    return <div>{ list }</div> 
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
