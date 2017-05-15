import Quill from "quill";
import Parchment from "parchment";
import Delta from 'quill-delta';
import {DEFAULT_ATTRIBUTES} from './promote_video';
import htmlBeautify from 'html-beautify';
import {updateEditorContents} from '../utils';

export const defaultHandlers = {
  clean: function() {
    let range = this.quill.getSelection();
    if (range == null) return;
    if (range.length == 0) {
      let formats = this.quill.getFormat();
      Object.keys(formats).forEach((name) => {
        // Clean functionality in existing apps only clean inline formats
        if (Parchment.query(name, Parchment.Scope.INLINE) != null) {
          this.quill.format(name, false);
        }
      });
    } else {
      let contents = this.quill.getContents(range);
      let start_index = range.index;

      for (let i=0; i < contents.ops.length; i++) {
        let selection = contents.ops[i];

        // Check for images and videos - don't clear them - just clear the attributes
        if (selection.insert && selection.insert instanceof Object) {
          let contents = this.quill.getContents(start_index, 1);
          let diff;
          if (selection.insert.image) {
            // If selection is image - remove attributes
            diff = contents.diff(new Delta([{
              insert: {
                image: selection.insert.image
              },
              attributes: {}
            }]));
          }

          if (selection.insert.video) {
            // If selection is video - set default attributes
            diff = contents.diff(new Delta([{
              insert: {
                video: selection.insert.video
              },
              attributes: {
                width: DEFAULT_ATTRIBUTES['width'],
                height: DEFAULT_ATTRIBUTES['height']
              }
            }]));
          }

          if (diff) {
            // Apply diff delta if there is any
            let delta = new Delta().retain(start_index).concat(diff);
            this.quill.editor.applyDelta(delta);
          }

          // Both images and videos only add 1 to the index returned by the selection item.
          start_index += 1;
        } else {
          let selection_length = selection.insert.length;
          // If the selection ends with \n, we should remove the \n.
          if (selection.insert.endsWith('\n'))
            this.quill.removeFormat(start_index, selection_length-1, Quill.sources.USER);
          else
            this.quill.removeFormat(start_index, selection_length, Quill.sources.USER);
          start_index += selection_length;
        }
      }
    }
  },
  divider: function() {
    if (!this.container.classList.contains("disabled")) {
      let range = editor.getSelection(true);
      editor.insertText(range.index, '\n', Quill.sources.USER);
      editor.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
      editor.setSelection(range.index + 2, Quill.sources.SILENT);
    }
  },
  link: function(value) {
    if (value) {
      let range = this.quill.getSelection();
      if (range == null || range.length == 0) return;
      let tooltip = this.quill.theme.tooltip;
      tooltip.edit('link');
    } else {
      this.quill.format('link', false);
    }
  },
  undo: function() {
    let undo_btn = this.container.getElementsByClassName("ql-undo")[0];
    if (!undo_btn.classList.contains("disabled") && !this.container.classList.contains("disabled")) {
      this.container.getElementsByClassName("ql-redo")[0].classList.remove("disabled");
      this.quill.history.undo();
      if (this.quill.history.stack.undo.length == 0)
        undo_btn.classList.add("disabled");
    }
  },
  redo: function() {
    let redo_btn = this.container.getElementsByClassName("ql-redo")[0];
    if (!redo_btn.classList.contains("disabled") && !this.container.classList.contains("disabled")) {
      let undo_btn = this.container.getElementsByClassName("ql-undo")[0];

      this.quill.history.redo();
      if (this.quill.history.stack.redo.length == 0)
        redo_btn.classList.add("disabled");

      undo_btn.classList.remove("disabled");
    }
  },
  showcode: function() {
    let editor = this.quill;
    let editorContainer = editor.container;
    let textarea = editor.textarea;

    if (textarea.style.display == 'none') {
      let qlEditorElement = editorContainer.firstChild;
      let editorHtml = qlEditorElement.innerHTML;
      textarea.style.width = qlEditorElement.clientWidth + "px";
      textarea.style.height = qlEditorElement.clientHeight + "px";
      editorContainer.style.display = 'none';
      textarea.style.display = 'block';
      this.container.classList.add("disabled");
      this.quill.disable();
      textarea.value = htmlBeautify(editorHtml);
    } else {
      updateEditorContents(editor, textarea);
      this.quill.enable();
      textarea.style.display = 'none';
      editorContainer.style.display = 'block';
      this.container.classList.remove("disabled");
    }
  }
};