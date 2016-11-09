'use babel';

import resolver from '../utils/tree-path-resolver';
import SelectView from '../views/template-chooser';
import NameView from '../views/modal-text';
import defer from '../utils/defer';
import template from '../utils/template-parser';

export default function(d) {

  const onAdd = atom.commands.add('atom-workspace', {
    'statwolf:addNewComponent': function(event) {
      const context = {
        path: resolver(event.target)
      };

      const selectView = new SelectView();
      let panel = atom.workspace.addModalPanel({ item: selectView });
      const onConfirm = function() {
        const nameView = new NameView('Insert a name for the component');
        nameView.once('exit', function() {
          panel.destroy();
        });
        nameView.once('confirm', function(item) {
          nameView.emit('exit');

          context.name = item;
          template(context);
        });
        panel = atom.workspace.addModalPanel({ item: nameView });
        nameView.update();
      };
      selectView.once('exit', function(confirmed) {
        panel.destroy();
      });
      selectView.once('confirm', function(item) {
        selectView.emit('exit', true);
        Object.assign(context, item);

        defer(onConfirm);
      });
    }
  });
  d.add(onAdd);

  console.log('Template engine ready.');
};
