'use babel';

import template from '../templates/search-result-template';
import n from '../utils/notifications';

const OUTPUT_NAME='statwolf://reverse-search-output';
const OUTPUT_PATH='statwolf:/reverse-search-output';
const OUTPUT_PATH_WIN = 'statwolf:\\reverse-search-output';

let _buffers = [];

export default class {

  constructor(d, fileList) {
    this.data = Object.assign({
      list: []
    }, fileList.getData());

    fileList.on('change', (status) => {
      this.data.list = status.list;

      this.update(true);
    });

    const onEditor = atom.workspace.observeTextEditors((editor) => {
      const path = editor.getPath();
      if(path !== OUTPUT_PATH && path !== OUTPUT_PATH_WIN) {
        return;
      }

      _buffers.push(editor);

      const onDestroy = editor.onDidDestroy(function() {
        _buffers = _buffers.filter(function(item) {
          return item !== editor;
        });
        onDestroy.dispose();
      });
      const jsGrammar = atom.grammars.grammars.find(function(grammar) {
        return grammar.name === 'JavaScript';
      });
      editor.setGrammar(jsGrammar);

      editor.save = function() {
        n.info('Statwolf reverse search', 'Save keybinding disabled on this buffer. Use Save As instead.');
      };

      this.update();
    });
    d.add(onEditor);
  }

  update(create) {
    create = create || false;

    if(_buffers.length === 0 && create) {
      atom.workspace.open(OUTPUT_NAME);
      return;
    }

    const output = (this.data.list || []).map(function(item) {
      return template(item);
    }).join(template.separator);

    _buffers.forEach((editor) => {
      editor.setText(output);
    });
  }

}
