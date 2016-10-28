'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';

export default class extends EventEmitter {

  constructor(online) {
    super();

    this.data = online.getData();
    online.on('change', (store) => {
      this.data = store;

      this.update();
    });

    etch.initialize(this);
  }

  render() {
    const style = {
      cursor: 'pointer'
    };

    return <div className="inline-block">
      <span className='text-success' style={ style } onclick={ () => { this.emit('toggle'); } }>{ this.data.online ? 'sw is ONLINE' : 'sw is OFFLINE' }</span>
    </div>
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
