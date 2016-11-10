'use babel';

const onReady = function(Statwolf) {
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
          data: {},
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
        statwolf.emit('pushDone', {}, e);
      }

    }

  };

  // router
  process.on('message', function(msg) {
    commands[msg.command](msg.payload, msg.id);
  });

  emit('server-ready');

};

try {
  const Statwolf = require('statwolf');
  onReady(Statwolf);
} catch(e) {
  console.log('Statwolf not installed installing it');
  var npm = require('npm');

  npm.load({
    registry: 'http://dev.statwolf.com:5984/'
  }, function(e) {
    npm.commands.install([ 'statwolf' ], function(e) {
      console.log('Statwolf ready');
      onReady(require('statwolf'));
    });

  });
}

