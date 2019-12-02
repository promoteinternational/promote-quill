import Quill from "quill";
let BlockEmbed = Quill.import('blots/block/embed');

class PromoteErrorMessage extends BlockEmbed {
  static create(value) {
    const node = super.create(value);

    if (value.classNames) {
      const classNames = Array.isArray(value.classNames) ? value.classNames : [value.classNames];
      classNames.unshift(node.className);
      node.className = classNames.join(' ')
    }

    const messageNode = document.createElement('span');
    messageNode.innerHTML = value.text;
    messageNode.className = '__editor-error-message';

    node.appendChild(messageNode);
    return node;
  }

  formats(){
    return PromoteErrorMessage.tagName;
  }

  static value(domNode) {
    const classNames = domNode.className.replace(PromoteErrorMessage.className, '').trim().split(' ');

    return {
      classNames,
      text: domNode.firstChild.innerText,
    };
  }
}

PromoteErrorMessage.blotName = 'error-msg';
PromoteErrorMessage.className = 'ql-error-msg';
PromoteErrorMessage.tagName = 'DIV';

export default PromoteErrorMessage;
