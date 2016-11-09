'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';

export default class extends EventEmitter {

  constructor(placeholder) {
    super();
    this.placeholder = placeholder;

    etch.initialize(this);
    this.update();
  }

  render() {
    return <div>
      <atom-text-editor ref="editor" onkeyup={ (event) => { this.throwEvent(event); } } attributes={ { mini: true, 'placeholder-text': this.placeholder } }></atom-text-editor>
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

  readAfterUpdate() {
    this.refs.editor.focus();
  }

  update() {
    return etch.update(this);
  }

  async destroy() {
    await etch.destroy(this);
  }

}
