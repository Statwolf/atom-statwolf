'use babel';

import { TextEditor } from 'atom';
import ConsoleMarker from './debugger-console-marker';
import dataStore from '../utils/data-store';

const store = dataStore('dbg-console');

export default class extends TextEditor {

  constructor(props) {
    super({
      autoHeight: false,
      showLineNumbers: false,
      lineNumberGutterVisible: false
    });

    this.processing = false;

    this.element.classList.add('statwolf');
    this.element.classList.add('console');

    const gutter = this.addGutter({ name: 'console' });
    const marker = this.markBufferRange(this.getBuffer().getRange());
    gutter.decorateMarker(marker, { item: new ConsoleMarker() });

    this.onWillInsertText((evt) => {
      console.log(this.isLastLine());
      if(this.processing === false && this.isLastLine() === true) {
        return;
      }

      evt.cancel();
    });

    this.element.onkeydown = (e) => {
      if(e.code !== 'ArrowUp' && e.code !== 'ArrowDown') {
        return;
      }

      e.stopPropagation();
    };

    this.element.onkeyup = (e) => {
      if(this.processing === true) {
        return;
      }

      if(e.code === 'Enter') {
        this.processing = true;

        const command = this.getTextInBufferRange([ [ store.getPosition().start, 0 ], [ Infinity, Infinity ] ] ).trim();
        if(command === '') {
          return;
        }
        store.emit('evaluate', command);
      }
    };

    const onUpdate = (data) => {
      this.processing = false;
      data.log = data.log || [];

      if(data.log.length > 0) {
        const log = data.log[data.log.length - 1];
        
        if(log.type === 'command') {
          return;
        }

        this.insertText(log.text || '');
        this.insertText('\n');
      }
    };
    store.on('change', onUpdate);
    onUpdate(store.getData());
  }

  async destroy() {
    await super.destroy();
  }

  isFirstColumn() {
    const position = this.getSelectedBufferRange();
    const lastRow = this.getLastBufferRow();

    if(position.end.column === 0 && position.end.row === lastRow) {
      return false;
    }

    return true;
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
    if(this.isFirstColumn() || this.isLastLine()) {
      super.delete();
    }
  }

  backspace() {
    if(this.isFirstColumn() || this.isLastLine()) {
      super.backspace();
    }
  }

}
