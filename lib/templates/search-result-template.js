'use babel';

const template = function(data) {
  return `${ data.path } (${ data.fileType })
matches:
${ data.matches.map(function(m) {
  return m;
}).join('\n') }`
};

template.separator = `

${ Array(81).join('-') }

`;

export default template;
