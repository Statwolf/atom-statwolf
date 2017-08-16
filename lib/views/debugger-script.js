'use babel'

/** @jsx etch.dom */

import { TextEditor } from 'atom';
import dataStore from '../utils/data-store';

export default class extends TextEditor {

  constructor(props) {
    super(props);

    this.onWillInsertText(function(evt) {
      evt.cancel();
    });

    const jsGrammar = atom.grammars.grammars.find(function(grammar) {
      return grammar.name === 'JavaScript';
    });
    this.setGrammar(jsGrammar);

    const scriptStore = dataStore('dbg-status');
    const update = (data) => {
      data.frame = data.frame || 0;
      const frame = ((data.stack || [])[data.frame] || {});
      
      this.setText(frame.source || '');

      this.setCursorBufferPosition([ frame.line, frame.column ])
    };
    scriptStore.on('change', update);
    update(scriptStore.getData());
  }

  backspace() {}
  delete() {}
  pasteText() {}

}
