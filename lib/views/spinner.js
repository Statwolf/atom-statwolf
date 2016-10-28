'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';

export default class extends EventEmitter {

  constructor(jobs) {
    super();

    this.data = jobs.getData();
    jobs.on('change', (store) => {
      this.data = store;

      this.update();
    });

    etch.initialize(this);
  }

  render() {
    let spinClass = 'icon icon-check';
    const spinStype = {};

    if(this.data.number > 0) {
      spinClass = 'loading loading-spinner-tiny';
      spinStype.marginTop = '5px';
    }

    return <div className="inline-block">
      <span style={ spinStype } className={ spinClass }></span>
    </div>
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
