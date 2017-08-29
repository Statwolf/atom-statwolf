'use babel';

/** @jsx etch.dom */

import etch from 'etch';
import EventEmitter from 'events';
import dataStore from '../utils/data-store';
import textEditor from '../utils/text-editor-resolver';

export default class extends EventEmitter {

  constructor(placeholder) {
    super();
    this.placeholder = placeholder;

    dataStore('showViews').on('change', (status) => {
      if(status.show === false) {
        this.destroy();
      }
    });

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
        debugger;
        this.emit('confirm', textEditor(event).getText());
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
