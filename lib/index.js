import Quill from "quill";
import Parchment from "parchment";
import Delta from 'quill-delta';
import Hr from './formats/hr';
import {DEFAULT_ATTRIBUTES, PromoteVideo} from './formats/promote_video';
import {addButton, addSelect, addTooltip, updateEditorContents, updateHtml} from './utils';
import htmlBeautify from 'html-beautify';

// Add custom icons
let icons = Quill.import('ui/icons');
icons['divider'] = '&minus;';         // TODO: Update to fa minus?
icons['showcode'] = require('../node_modules/quill/assets/icons/code.svg');
icons['undo'] = require('../node_modules/quill/assets/icons/undo.svg');
icons['redo'] = require('../node_modules/quill/assets/icons/redo.svg');

// Add default quill css
require("../node_modules/quill/dist/quill.snow.css");

// Add custom promote editor css
require("./css/promote-editor.css");

// Add custom hr tag and custom video settings
Quill.register({
  'formats/divider': Hr,
  'formats/video': PromoteVideo
}, true);

export function makeEditor(textarea, options = {}) {
  let os = "win";
  let editorId = parseInt(Math.random() * 10000);

  // Add check for os - used to show tooltip shortcuts
  if (/Linux/i.test(navigator.platform)) os = "lin";
  if (/Mac/i.test(navigator.platform)) os = "mac";

  /*
   * Add element for creating editor in - use random number so that element id can be used when multiple editors are
   * on the same page
   */
  let editorElement = document.createElement('div');
  editorElement.id = "editor-container-" + editorId;
  textarea.parentNode.insertBefore(editorElement, textarea);
  textarea.style.boxSizing = "border-box";

  /*
   * Add element for toolbar - use the same random number as in the element id for the editor container.
   */
  let toolbarElement = document.createElement('div');
  toolbarElement.id = "toolbar-container-" + editorId;
  textarea.parentNode.insertBefore(toolbarElement, editorElement);

  // Make sure textarea is not visible
  textarea.style.display = "none";

  // Create tooltips for editor
  options.tooltips = options.tooltips || {};
  options.tooltips.bold = addTooltip(options, "bold", 'Toggle bold style', os, "(ctrl+b)", "(cmd+b)");
  options.tooltips.italic = addTooltip(options, "italic", 'Toggle emphasis', os, "(ctrl+i)", "(cmd+i)");
  options.tooltips.link = addTooltip(options, "link", 'Add / edit link', os, "(ctrl+k)", "(cmd+k)");
  options.tooltips.header = addTooltip(options, "header", 'Select header type');
  options.tooltips.list_ordered = addTooltip(options, "list_ordered", 'Wrap in ordered list');
  options.tooltips.list_bullet = addTooltip(options, "list_bullet", 'Wrap in bullet list');
  options.tooltips.blockquote = addTooltip(options, "blockquote", 'Wrap in block quote');
  options.tooltips.align = addTooltip(options, "align", 'Select alignment');
  options.tooltips.video = addTooltip(options, "video", 'Insert video');
  options.tooltips.divider = addTooltip(options, "divider", 'Insert divider');
  options.tooltips.undo = addTooltip(options, "undo", 'Undo', os, "(ctrl+z)", "(cmd+z)");
  options.tooltips.redo = addTooltip(options, "redo", 'Redo', os, "(ctrl+shift+z)", "(cmd+shift+z)", "(ctrl+y)");
  options.tooltips.clean = addTooltip(options, "clean", 'Remove all formatting on selected text');
  options.tooltips.showcode = addTooltip(options, "showcode", 'Toggle code view');

  toolbarElement.innerHTML = options.toolbar_items ||
    // Add simple formatting buttons
    '<span class="ql-formats">' +
    addButton(options, "bold") +
    addButton(options, "italic") +
    addButton(options, "link", {disabled:true}) +
    '</span>' +
    // Add header dropdown
    '<span class="ql-formats">' +
    addSelect(options, "header", [1, 2, 3, null]) +
    '</span>' +
    // Add list buttons
    '<span class="ql-formats">' +
    addButton(options, "list", {value: "ordered"}) +
    addButton(options, "list", {value: "bullet"}) +
    addButton(options, "blockquote") +
    '</span>' +
    // Add alignment button
    '<span class="ql-formats">' +
    addSelect(options, "align", [null, 'center', 'right']) +
    '</span>' +
    // Add image, pictures and hr tags
    '<span class="ql-formats">' +
    addButton(options, "video") +
    addButton(options, "divider") +
    '</span>' +
    // Add undo / redo / clean buttons
    '<span class="ql-formats">' +
    addButton(options, "undo", {disabled:true}) +
    addButton(options, "redo", {disabled:true}) +
    addButton(options, "clean") +
    '</span>' +
    // Add show code button
    '<span class="ql-formats">' +
    addButton(options, "showcode") +
    '</span>';

  // Add our default toolbar
  options.modules = options.modules || {};
  options.modules.toolbar = options.modules.toolbar || {};
  options.modules.toolbar.container = options.modules.toolbar.container || "#" + toolbarElement.id;

  // Add the toolbar module handlers
  options.modules.toolbar.handlers = options.modules.toolbar.handlers || {
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

        for (let selection of contents.ops) {
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
      let editorContainer = this.quill.container;

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

  // Make sure only our custom formats are used
  options.formats = options.formats || [
    // Add default quilljs formats we want
    'align',
    'blockquote',
    'bold',
    'divider',
    'header',
    'italic',
    'image',
    'link',
    'list',
    'video',

    // Add attributes that we want to be able to parse as well (used on images and video links)
    'alt',
    'height',
    'width'
  ];

  options.theme = 'snow';

  // Create editor in the newly created element with the correct options
  let editor = new Quill(editorElement, options);

  // Add current textarea value
  updateEditorContents(editor, textarea);
  editor.history.clear();

  // Set default text for link placeholder
  editorElement.getElementsByClassName("ql-tooltip")[0].getElementsByTagName('input')[0].setAttribute('data-link', "Embed link");

  // Add custom handlers for custom buttons
  let toolbar = editor.getModule('toolbar');

  let undo_btn = toolbar.container.getElementsByClassName("ql-undo")[0],
      link_btn = toolbar.container.getElementsByClassName("ql-link")[0];

  // Sync all text changes to the textarea in the form
  editor.on(Quill.events.EDITOR_CHANGE, (eventName, ...args) => {
    // Do not sync changes when the editor is disabled.
    if (editor.isEnabled()) {
      let range = editor.getSelection();

      if (eventName === Quill.events.TEXT_CHANGE)
        undo_btn.classList.remove("disabled");

      if (range == null || range.length == 0)
        link_btn.classList.add("disabled");
      else
        link_btn.classList.remove("disabled");

      updateHtml(textarea, editor.container.firstChild.innerHTML);
    }
  });

  return editor;
}

window.makeEditor = makeEditor;