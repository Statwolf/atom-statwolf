'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';

const _unwrapData = function(target, envSrc, statusSrc) {
  if(envSrc != null) {
    target.name = envSrc.env.name;
    target.host = envSrc.env.host;
    target.color = envSrc.env.color;
  }


  if(statusSrc != null) {
    target.online = statusSrc.online;
  }
};

export default class extends EventEmitter {

  constructor(env, online) {
    super();

    this.data = {};
    _unwrapData(this.data, env.getData(), online.getData());

    env.on('change', (store) => {
      _unwrapData(this.data, store);

      this.update();
    });
    online.on('change', (store) => {
      _unwrapData(this.data, null, store);

      this.update();
    });

    etch.initialize(this);
  }

  render() {
    const style = {
      backgroundImage: `linear-gradient(${ this.data.color }, #2F4F4F)`
    };

    return <div className="inline-block">
      <button disabled={ this.data.online ? false : true } onclick={ () => { this.emit('toggle-env'); } } className="btn btn-xs" style={ style }>{ this.data.name } on { this.data.host }</button>
    </div>
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
