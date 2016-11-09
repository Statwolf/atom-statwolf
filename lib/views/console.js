'use babel';

import conf from '../utils/configurations';
import n from '../utils/notifications';
import disposable from '../utils/disposable';

const OUTPUT_NAME="statwolf://console-output";
const OUTPUT_PATH="statwolf:/console-output";
const LOG_NAME="statwolf://console-log";
const LOG_PATH="statwolf:/console-log";

let outputBuffers = [];
let logBuffers = [];

export default class {

  constructor(output) {
    this.data = Object.assign({
      logs: [],
      error: null,
      output: ''
    }, output.getData());
    output.on('change', (store) => {
      this.data = store;

      this.update(true);
    });

    const onEditor = () => {
      return atom.workspace.observeTextEditors((editor) => {
        let onDestroy;

        switch(editor.getPath()) {
          case OUTPUT_PATH:
            outputBuffers.push(editor);
            onDestroy = editor.onDidDestroy(function() {
              outputBuffers = outputBuffers.filter(function(item) {
                return item !== editor;
              });
              onDestroy.dispose();
            });
            const jsGrammar = atom.grammars.grammars.find(function(grammar) {
              return grammar.name === 'JavaScript';
            });
            editor.setGrammar(jsGrammar);
            break;
          case LOG_PATH:
            logBuffers.push(editor);
            onDestroy = editor.onDidDestroy(function() {
              logBuffers = logBuffers.filter(function(item) {
                return item !== editor;
              });
              onDestroy.dispose();
            });
            break;
          default:
            return;
        }

        editor.save = function() {
          n.info('Statwolf console', 'Save keybinding disabled on this buffer. Use Save As instead.');
        };

        this.update(false);
      });
    };
    disposable(onEditor);
  }

  update(create) {
    create = create || false;

    if(outputBuffers.length === 0 && create) {
      atom.workspace.open(OUTPUT_NAME);
    }
    if(logBuffers.length === 0 && create) {
      atom.workspace.open(LOG_NAME);
    }
    if(outputBuffers.length === 0 || logBuffers.length === 0) {
      return;
    }

    let outputText;
    if(this.data.error) {
      outputText = `${ this.data.error.name }\n${ this.data.error.stack }`;
    }
    else {
      outputText = this.data.output;
    }

    if(outputText === null) {
      outputText = 'null';
    }
    else if(outputText === undefined) {
      outputText = 'undefined';
    }
    else if(typeof outputText === 'number' || typeof outputText === 'boolean' || typeof outputText === 'function') {
      outputText = outputText.toString();
    }
    else if(typeof outputText === 'object') {
      outputText = JSON.stringify(outputText, null, 2);
    }

    if(outputText.length > conf.outputBufferLength) {
      outputText = `${ outputText.substring(0, conf.outputBufferLength) }\n...`;
    }
    outputBuffers.forEach(function(buffer) {
      buffer.setText(outputText);
    });

    let logText = this.data.logs.map(function(item) {
      return `${ item.timestamp } - ${ item.msg }`;
    }).join('\n')
    if(logText.length > conf.outputBufferLength) {
      logText = `${ logText.substring(0, conf.outputBufferLength) }\n...`;
    }
    logBuffers.forEach(function(buffer) {
      buffer.setText(logText)
    });

  }

}
