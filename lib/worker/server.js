'use babel';

import Statwolf from 'statwolf';
const statwolf = new Statwolf();

const reply = function(id, payload) {

  if (payload.error && (payload.error.constructor === Error || payload.error.constructor === SyntaxError)) {
    var message = payload.error.message;

    if(payload.error.filename) {
      message = `
${ payload.error.filename }
${message}
`;
    }

    payload.error = {
      message,
      stack: payload.error.stack
    }
  }

  emit(id, payload);
};

const commands = {

  execute: function(payload, id) {

    try {
      const commandId = statwolf.runCommand(payload);
      statwolf.once(`commandEvaluated::${ commandId }`, function(data, error) {
        if (typeof data.result === 'function') {
          data.result = data.result.toString();
        }

        reply(id, {
          error,
          data
        });
      });
    } catch (error) {
      reply(id, {
        data: {},
        error
      });
    }

  },

  delete: function(payload, id) {

    statwolf.once('deleteDone', function(data, error) {
      reply(id, {
        error,
        data
      });
    });

    try {
      statwolf.delete(payload);
    } catch (e) {
      statwolf.emit('deleteDone', {}, e);
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
    } catch (e) {
      statwolf.emit('pushDone', {}, e);
    }

  }

};

// router
process.on('message', function(msg) {
  commands[msg.command](msg.payload, msg.id);
});

emit('server-ready');
