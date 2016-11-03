'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';

export default class extends EventEmitter {

  constructor() {
    super();

    etch.initialize(this);
  }

  render() {
    return <div className="statwolf-path-input">
      <atom-text-editor ref="editor" onkeyup={ (event) => { this.throwEvent(event); } } attributes={ { mini: true, 'placeholder-text': 'Insert a Statwolf path' } }></atom-text-editor>
    </div>
  }

  throwEvent(event) {
    switch(event.code) {
      case 'Escape':
        this.emit('exit');
        break;
      case 'Enter':
        this.emit('confirm', event.target.getModel().getText());
        break;
    }
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
