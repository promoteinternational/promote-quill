import Quill from "quill";
let Parchment = Quill.import('parchment');
import { sanitize } from 'quill/formats/link';

const ATTRIBUTES = [
  'alt',
  'height',
  'width',
  'srcset',
  'sizes',
  'data-placeholder-id'
];
// TODO: tag with id of attachment?
// desktop max-width: 700
// iphone6+ max-width: 324

class PromoteImage extends Parchment.Embed {
  static create({url, placeholderId}) {
    console.log('PromoteImage.create url', url, 'placeholderId', placeholderId);
    let node = super.create(url);
    if (typeof url === 'string') {
      node.setAttribute('src', this.sanitize(url));
    }
    if (placeholderId) {
      node.setAttribute('data-placeholder-id', placeholderId);
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

  static generateImageHandler(triggerUpload) {
    return function() {
      console.log('imageHandler');
      // Insert placeholder/progress image
      const range = this.quill.getSelection();
      const url = 'https://via.placeholder.com/350x150';
      const placeholderId = parseInt(Math.random() * 100000);
      this.quill.insertEmbed(range.index, 'image', {url, placeholderId});

      // Call trigger upload callback and send in onCreate callback to replace
      // placeholder with uploaded image.
      triggerUpload(function(url) {
        console.log('triggerUpload url', url, 'placeholderId', placeholderId);
        if (url) {
          var node = document.querySelectorAll('img[data-placeholder-id="' + placeholderId + '"]')[0];
          if (node) {
            var blot = Parchment.find(node);
            blot.replaceWith('image', {url});
          }
        }
      });
    };
  }
}

PromoteImage.blotName = 'image'
PromoteImage.className = 'ql-image';
PromoteImage.tagName = 'IMG';

export {PromoteImage};
