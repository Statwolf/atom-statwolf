'use babel';

import fs from 'fs-plus';
import n from './notifications';
import { allowUnsafeNewFunction } from 'loophole'
import H from 'handlebars';
import path from 'path';
import rootPath from './root-path-finder';

H.registerHelper('swPath', function(componentPath) {
  return componentPath.split(path.sep).join('.');
});

const compile = function(text, context) {
  return allowUnsafeNewFunction(function() {
    return H.compile(text)(context);
  });
};

const compilePath = function(componentPath, context) {
  return compile(componentPath, context).replace(context.dir, context.path);
};

export default function(context) {
  context.basePath = context.path.replace(rootPath() + path.sep, '');

  console.log('Compiling template context:');
  console.log(context);

  let hasError = false;

  const onFile = function(filePath) {
    const compiledPath = compilePath(filePath, context);
    const src = fs.readFileSync(filePath, 'utf8');

    const compiledSrc = compile(src, context);

    fs.writeFileSync(compiledPath, compiledSrc);
  };

  const onDir = function(dirPath) {
    const compiledPath = compilePath(dirPath, context);

    if(fs.existsSync(compiledPath)) {
      hasError = true;
      return false;
    }

    fs.mkdirSync(compiledPath);

    return true;
  };

  const onDone = function() {
    if(hasError) {
      n.error('Statwolf template', `Component ${ context.name } already exists in ${ context.path }`, true);
      return;
    }

    n.info('Statwolf template', `Template ${ context.label } created into ${ context.path } folder`);
  };

  fs.traverseTree(context.dir, onFile, onDir, onDone);
};
