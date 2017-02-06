import Quill from "quill"
let BlockEmbed = Quill.import('blots/block/embed');

class Hr extends BlockEmbed { }
Hr.blotName = 'divider';
Hr.tagName = 'hr';

export default Hr;