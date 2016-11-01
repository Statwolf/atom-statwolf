'use babel';

module.exports = function(command) {
  return `
  var result = (function() {
    ${command}
  })();

  if(_.isPlainObject(result)) {
    result = [ result ];
  }
  if(_.isArray(result) && _.every(result, (i) => _.isPlainObject(i)))
    var parser = $compiler.service('Statwolf.Utils.CSVParser');
    result = parser.jsonToCsv(result, '\t');


  return result;
  `;
};
