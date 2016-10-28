'use babel';

const module = {};

module.error = function(title, msg, dismissable) {
  atom.notifications.addError(title, {
    detail: msg,
    dismissable
  });
}

module.info = function(title, msg) {
  atom.notifications.addInfo(title, {
    detail: msg
  });
}

export default module;
