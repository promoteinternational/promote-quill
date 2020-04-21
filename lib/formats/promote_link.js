import Quill from "quill";
import {LinkParser} from '../link_parser'
let Link = Quill.import('formats/link');

class PromoteLink extends Link {
  static create(value) {
    let node = super.create(value);
    node.setAttribute('href', LinkParser.ensureProtocol(node.getAttribute('href')));
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
    return node;
  }
}

export {PromoteLink};

