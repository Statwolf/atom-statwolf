'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';
import dataStore from '../utils/data-store';

export default class extends EventEmitter {

  constructor(jobs) {
    super();

    this.data = jobs.getData();
    this.timeoutTime = 600000;

    const askForReset = () => {
      var result = confirm('A job is spending too much time to complete. Do you want to reset the job queue?', 'Statwolf');

      if(result === false) {
        this.timeoutId = setTimeout(askForReset, this.timeoutTime);
        return;
      }

      jobs.getData().number = 0;
      jobs.notify();
    }

    jobs.on('change', (store) => {
      this.data = store;

      clearTimeout(this.timeoutId);

      if(store.number > 0) {
        this.timeoutId = setTimeout(askForReset, this.timeoutTime);
      }

      this.update();
    });

    dataStore('showViews').on('change', (status) => {
      if(status.show === false) {
        this.destroy();
      }
    });

    etch.initialize(this);
  }

  render() {
    let spinClass = 'icon icon-check inline-block';
    let text = 'Ready';
    const spinStype = {};

    if(this.data.number > 0) {
      spinClass = 'loading loading-spinner-tiny inline-block';
      spinStype.marginTop = '7px';
      spinStype.marginRight = '5px';
      text = 'Loading';
    }

    return <div className="inline-block">
      <span style={ spinStype } className={ spinClass }></span><span className="inlineBlock">{ text } </span>
    </div>
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
