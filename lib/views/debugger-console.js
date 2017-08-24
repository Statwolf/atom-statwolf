'use babel';

import { TextEditor } from 'atom';
import ConsoleMarker from './debugger-console-marker';
import dataStore from '../utils/data-store';

const store = dataStore('dbg-console');
const history = dataStore('dbg-history');

export default class extends TextEditor {

  constructor(props) {
    super({
      autoHeight: false,
      showLineNumbers: false,
      lineNumberGutterVisible: false
    });

    //this.processing = false;

    this.element.classList.add('statwolf');
    this.element.classList.add('console');

    const gutter = this.addGutter({ name: 'console' });
    const marker = this.markBufferRange(this.getBuffer().getRange());
    gutter.decorateMarker(marker, { item: new ConsoleMarker() });

    this.onWillInsertText((evt) => {
      //if(this.processing === true || this.isLastLine() === false) {
      if(this.isLastLine() === false) {
        evt.cancel();
        return;
      }

      if(evt.text !== '\n') {
        return;
      }

      const command = this.getTextInBufferRange([ [ store.getPosition().start, 0 ], [ Infinity, Infinity ] ] ).trim();
      if(command === '') {
        evt.cancel();
        return;
      }

      //this.processing = true;
      this.setCursorBufferPosition([ Infinity, Infinity ]);

      setTimeout(function() {
        store.emit('evaluate', command);
      }, 0);
    });

    this.element.onkeydown = (e) => {
      if(e.code !== 'ArrowUp' && e.code !== 'ArrowDown') {
        return;
      }

      if(!this.isLastLine()) {
        return;
      }

      e.stopPropagation();
      const lastRow = this.getLastBufferRow();
      const data = e.code === 'ArrowUp' ? history.up() : history.down();

      if(data == null) {
        return;
      }

      this.buffer.setTextInRange([ [ lastRow, 0 ], [ lastRow, Infinity ] ], data);
    };

    const onUpdate = (data) => {
      //this.processing = false;
      data.log = data.log || [];

      if(data.log.length > 0) {
        const log = data.log[data.log.length - 1];

        if(log.type === 'command') {
          return;
        }

        this.insertText(`${ log.text || '' }\n`);
      } else {
        this.setText('');
      }
    };
    store.on('change', onUpdate);
    onUpdate(store.getData());
  }

  async destroy() {
    await super.destroy();
  }

  isLastLine() {
    const position = this.getSelectedBufferRange();
    const lastRow = this.getLastBufferRow();

    if(position.start.row < lastRow || position.end.row < lastRow) {
      return false;
    }

    return true;
  }

  delete() {
    if(this.isLastLine()) {
      super.delete();
    }
  }

  backspace() {
    const position = this.getSelectedBufferRange();
    if(this.isLastLine() && (position.start.column > 0 || position.end.column > 0)) {
      super.backspace();
    }
  }

  cutSelectedText() {
    if(this.isLastLine()) {
      super.cutSelectedText();
    }
  }

}
