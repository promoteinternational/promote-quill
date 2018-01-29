import Quill from "quill";
let Link = Quill.import('formats/link');

class PromoteLink extends Link {
  static create(value) {
    let node = super.create(value);
    node.setAttribute('href', ensureProtocol(node.getAttribute('href')));
    return node;
  }
}

function ensureProtocol(url) {
  // Add https as default if protocol is missing
  if (url.indexOf('://') === -1) {
    url = 'https://' + url;
  }
  // Get rid of extra backslases
  url = url.replace(/^([^:]*):*\/*/, '$1://');
  return url;
}

export {PromoteLink, ensureProtocol};

