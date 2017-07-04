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
  return (url.indexOf('://') === -1) ? 'https://' + url : url
}

export {PromoteLink};

