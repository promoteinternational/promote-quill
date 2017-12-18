import Quill from "quill";
let Parchment = Quill.import('parchment');
import { sanitize } from 'quill/formats/link';

const ATTRIBUTES = [
  'alt',
  'height',
  'width',
  'srcset',
  'sizes'
];
// TODO: tag with id of attachment?
// desktop max-width: 700
// iphone6+ max-width: 324

class PromoteImage extends Parchment.Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  //static match(url) {
  //  return /\.(jpe?g|gif|png)$/.test(url);
  //}

  static sanitize(url) {
    return sanitize(url, ['http', 'https']) ? url : '//:0';
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }

  static imageHandler() {
    // Insert placeholder image
    // TODO: Read image before upload and use as placeholder?
    const placeholderUrl = 'https://via.placeholder.com/350x150';
    const range = this.quill.getSelection();
    this.quill.insertEmbed(range.index, 'image', placeholderUrl);

    // Listen to finished upload and update with real image
    var fileInput = document.getElementsByClassName('js-attachment-editor-file')[0];
    if (!fileInput) {
      console.log('No js-attachment-file input found');
      return false;
    }
    var self = this;
    // FIXME: Don't add new listener every time...
    fileInput.addEventListener('attachment.create', function(event) {
      console.log('attachment.create', event);
      if (event.detail.url) {
        const range = self.quill.getSelection();
        self.quill.insertEmbed(range.index, 'image', event.detail.url);
      }
    });

    // Trigger upload
    fileInput.click();
  }
}

PromoteImage.blotName = 'image'
PromoteImage.className = 'ql-image';
PromoteImage.tagName = 'IMG';

export {PromoteImage};
