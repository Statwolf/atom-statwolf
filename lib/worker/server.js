'use babel';

import Statwolf from 'statwolf';
const statwolf = new Statwolf();

const reply = function(id, payload) {

  if(payload.error && (payload.error.constructor === Error || payload.error.constructor === SyntaxError)) {
    payload.error = {
      message: payload.error.message,
      stack: payload.error.stack,
      filename: payload.error.filename
    }
  }

  emit(id, payload);
};

const commands = {

  execute: function(payload, id) {

    try {
      const commandId = statwolf.runCommand(payload);
      statwolf.once(`commandEvaluated::${ commandId }`, function(data, error) {
        if(typeof data.result === 'function') {
          data.result = data.result.toString();
        }

        reply(id, {
          error,
          data
        });
      });
    } catch(error) {
      reply(id, {
        error
      });
    }

  },

  push: function(payload, id) {

    statwolf.once('pushDone', function(data, error) {
      reply(id, {
        error,
        data
      });
    });

    try {
      statwolf.push(payload);
    } catch(e) {
      statwolf.emit('pushDone', null, e);
    }

  }

};

// router
process.on('message', function(msg) {
  commands[msg.command](msg.payload, msg.id);
});

emit('server-ready');
