import Editor from 'quill/core/editor';
import Emitter from 'quill/core/emitter';
import Selection from 'quill/core/selection';
import Scroll from 'quill/blots/scroll';
import Quill from 'quill/core/quill';

export function initialize(klass, html, container = this.container) {
  if (typeof html === 'object') {
    container.innerHTML = html.html;
  } else {
    container.innerHTML = html.replace(/\n\s*/g, '');
  }
  if (klass === HTMLElement) return container;
  if (klass === Quill) return new Quill(container);
  let emitter = new Emitter();
  let scroll = new Scroll(container, { emitter: emitter });
  if (klass === Scroll) return scroll;
  if (klass === Editor) return new Editor(scroll);
  if (klass === Selection) return new Selection(scroll, emitter);
  if (klass[0] === Editor && klass[1] === Selection) {
    return [new Editor(scroll), new Selection(scroll, emitter)];
  }
}