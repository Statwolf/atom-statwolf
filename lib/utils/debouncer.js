'use babel';

export default function(func, wait) {
  wait = wait || 250;
  let id;
  
  return function() {
    const self = this;
    const args = arguments;

    clearTimeout(id);
    id = setTimeout(function() {
      func.apply(self, args);
    }, wait);
  };
};
