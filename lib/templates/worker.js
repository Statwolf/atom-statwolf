'use babel';

module.exports = function(command) {
  return `
    return $userFactory.get('atom').workflow(function() {
      return (function() {
        ${ command }
      })();
    });
  `;
};
