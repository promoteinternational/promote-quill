import Quill from "quill"
let Video = Quill.import('formats/video');

class PromoteVideo extends Video {
  static create(value) {
    let node = super.create(value);
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);
    node.setAttribute('src', this.sanitize(value));
    node.setAttribute('width', '500');
    node.setAttribute('height', '281');
    return node;
  }
}
PromoteVideo.blotName = 'video';
PromoteVideo.className = 'ql-video';
PromoteVideo.tagName = 'IFRAME';

export default PromoteVideo
