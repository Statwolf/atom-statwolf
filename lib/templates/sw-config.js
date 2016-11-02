'use babel'

module.exports = {
  environments: [{
    name: 'test',
    host: 'http://127.0.0.1',
    port: 8080,
    userId: 'statwolf',
    token: 'test123',
    color: 'green'
  }, {
    name: 'production',
    host: 'http://127.0.0.1',
    port: 8080,
    userId: 'boss',
    token: 'test123',
    color: 'red'
  }],
  outputBufferLength: 25000
};
