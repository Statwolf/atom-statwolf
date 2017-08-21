'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import dataStore from '../utils/data-store';

const store = dataStore('dbg-console');

export default class {

  constructor() {
    const lineHeight = Math.floor(atom.config.get('editor.fontSize') * atom.config.get('editor.lineHeight'));

    const onUpdate = (data) => {
      this.lines = (data.log || []).map((log) => {
        console.log(log);
        return {
          direction: log.type === 'command' ? 'right' : 'left',
          height: `${ lineHeight * (log.position.end - log.position.start + 1) }px`
        }
      });

      this.update();
    };
    store.on('change', onUpdate);
    etch.initialize(this);
  }

  render() {
    const markers = (this.lines || []).concat({ direction: 'right' }).map(function(l) {
      return <div style={ `height: ${ l.height }` }><span className={ `icon icon-chevron-${ l.direction }` }></span></div>
    });

    return <div>{ markers }</div>
  }

  update() {
    etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}

