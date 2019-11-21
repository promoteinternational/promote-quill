import Quill from "quill";
let BlockEmbed = Quill.import('blots/block/embed');

class PromoteErrorMessage extends BlockEmbed {
  static create(value) {    
    const node = super.create(value);
    
    const input = document.createElement('span');
    input.innerHTML = value
    input.className = '__editor-error-message'
    
    node.appendChild(input);
    return node;
  }

  formats(){
    return PromoteErrorMessage.tagName;
  }

  static value(domNode) {
    return domNode.firstChild.innerText;
  }
}

PromoteErrorMessage.blotName = 'error-msg';
PromoteErrorMessage.className = 'ql-error-msg';
PromoteErrorMessage.tagName = 'DIV';

export default PromoteErrorMessage;
