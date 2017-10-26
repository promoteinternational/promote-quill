import Quill from "quill";
let BlockEmbed = Quill.import('blots/block/embed');

// Set default values for the video iframe - used if no values are set or on creation.
const DEFAULT_ATTRIBUTES = {
  'height': 281,
  'width': 500
};

class PromoteVideo extends BlockEmbed {
  static create(value) {
    // Override create method - make sure default size is used.
    let node = super.create(value);
    let iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', true);
    iframe.setAttribute('height', DEFAULT_ATTRIBUTES['height']);
    iframe.setAttribute('width', DEFAULT_ATTRIBUTES['width']);
    iframe.setAttribute('src', ensureProtocol(extractVideoUrl(value)));
    node.appendChild(iframe);
    return node;
  }

  static formats(domNode) {
    // Override default formats static method to make sure that the default sizes are used on the video
    return Object.keys(DEFAULT_ATTRIBUTES).reduce(function(formats, attribute) {
      if (domNode.firstChild.hasAttribute(attribute)) {
        formats[attribute] = domNode.firstChild.getAttribute(attribute);
      } else {
        formats[attribute] = DEFAULT_ATTRIBUTES[attribute];
      }
      return formats;
    }, {});
  }

  static value(domNode) {
    return domNode.firstChild.getAttribute('src');
  }

  format(name, value) {
    // Override default format method to set default size for height and width
    if (DEFAULT_ATTRIBUTES.hasOwnProperty(name)) {
      if (value) {
        this.domNode.firstChild.setAttribute(name, value);
      } else {
        this.domNode.firstChild.setAttribute(name, DEFAULT_ATTRIBUTES[name]);
      }
    } else {
      super.format(name, value);
    }
  }
}
PromoteVideo.blotName = 'video';
PromoteVideo.className = 'ql-video';
PromoteVideo.tagName = 'DIV';

function ensureProtocol(url) {
  return (url.indexOf('://') === -1) ? 'https://' + url : url
}

// TODO: remove if/when upstream releases new version: https://github.com/quilljs/quill/pull/1517
function extractVideoUrl(url) {
  let match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
              url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return (match[1] || 'https') + '://www.youtube.com/embed/' + match[2] + '?showinfo=0';
  }
  if (match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) {  // eslint-disable-line no-cond-assign
    return (match[1] || 'https') + '://player.vimeo.com/video/' + match[2] + '/';
  }
  return url;
}

export {DEFAULT_ATTRIBUTES, PromoteVideo};
