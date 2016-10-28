'use babel';

import Statwolf from 'statwolf';
const statwolf = new Statwolf();

const commands = {

  push: function(payload, id) {

    statwolf.once('pushDone', function(data, error) {
      emit(id, {
        error,
        data
      });
    });

    statwolf.push(payload);

  }

};

// router
process.on('message', function(msg) {
  commands[msg.command](msg.payload, msg.id);
});

emit('server-ready');
