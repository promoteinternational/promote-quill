import Quill from "quill"
let Video = Quill.import('formats/video');

class PromoteVideo extends Video {
  static create(value) {
    if (value) {
      let node = super.create(value);
      node.setAttribute('width', '500');
      node.setAttribute('height', '281');

      return node;
    }
    return null;
  }
}
PromoteVideo.blotName = 'video';
PromoteVideo.className = 'ql-video';
PromoteVideo.tagName = 'IFRAME';

export default PromoteVideo
