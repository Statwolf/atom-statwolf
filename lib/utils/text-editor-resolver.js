'use babel';

const finder = function(element) {
  if(element.target != null) {
    element = element.target;
  }

  if(element.tagName === 'ATOM-TEXT-EDITOR') {
    return element.getModel();
  }

  return finder(element.parentElement);
};

export default finder;
