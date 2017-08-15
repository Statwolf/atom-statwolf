'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import dataStore from '../utils/data-store';

export default class {
  
  constructor() {
    const info = dataStore('debug');
    const onList = (data) => {
      this.list = data.debuggers;

      if(this.list == null || this.list.length === 0) {
        this.list = [ 'No engine in debug mode' ];
      }

      this.update();
    };
    info.on('change', onList);

    etch.initialize(this);
    onList(info.getData());
  }

  render() {
    return <div>{ (this.list || []).map(function(d) {
      return <span>d</span>
    }) }</div> 
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
