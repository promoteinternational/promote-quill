import Quill from "quill"
import Hr from './hr'
import pretty from "pretty"
import {addButton, addSelect, addTooltip, updateEditorContents, updateHtml} from './utils';

// Add default quill css
require("../node_modules/quill/dist/quill.snow.css");

// Add custom promote editor css
require("./promote-editor.css");

let icons = Quill.import('ui/icons');

// Add custom icons
icons['divider'] = '&minus;';         // FIXME: Update to fa minus?
icons['showcode'] = '<svg viewbox="0 0 18 18"><polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"></polyline><polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"></polyline><line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"></line></svg>';
icons['undo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon><path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>';
icons['redo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon><path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>';

Quill.register(Hr);

export function makeEditor(textarea, options = {}) {
  let os = "win";
  let editorId = parseInt(Math.random() * 10000);

  if (/Linux/i.test(navigator.platform)) os = "lin";
  if (/Mac/i.test(navigator.platform)) os = "mac";

  // Add element for creating editor in
  let editorElement = document.createElement('div');
  editorElement.id = "editor-container-" + editorId;
  textarea.parentNode.insertBefore(editorElement, textarea);
  textarea.style.boxSizing = "border-box";

  let toolbarElement = document.createElement('div');
  toolbarElement.id = "toolbar-container-" + editorId;
  textarea.parentNode.insertBefore(toolbarElement, editorElement);

  // Make sure textarea is not visible
  textarea.style.display = "none";

  options.tooltips = options.tooltips || {};

  options.tooltips.bold = addTooltip(options, "bold", 'Toggle bold style', os, "(ctrl+b)", "(cmd+b)");
  options.tooltips.italic = addTooltip(options, "italic", 'Toggle emphasis', os, "(ctrl+i)", "(cmd+i)");
  options.tooltips.link = addTooltip(options, "link", 'Add / edit link', os, "(ctrl+k)", "(cmd+k)");
  options.tooltips.header = addTooltip(options, "header", 'Select header type');
  options.tooltips.list_ordered = addTooltip(options, "list_ordered", 'Wrap in ordered list');
  options.tooltips.list_bullet = addTooltip(options, "list_bullet", 'Wrap in bullet list');
  options.tooltips.blockquote = addTooltip(options, "blockquote", 'Wrap in block quote');
  options.tooltips.align = addTooltip(options, "align", 'Select alignment');
  options.tooltips.image = addTooltip(options, "image", 'Insert image');
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
    addButton(options, "link") +
    '</span>' +
    // Add header dropdown
    '<span class="ql-formats">' +
    addSelect(options, "header", [1, 2, 3, 4, 5, 6, null]) +
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
    addButton(options, "image") +
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
    divider: function() {
      if (!this.container.classList.contains("disabled")) {
        let range = editor.getSelection(true);
        editor.insertText(range.index, '\n', Quill.sources.USER);
        editor.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
        editor.setSelection(range.index + 2, Quill.sources.SILENT);
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
        let qlEditorElement = editorContainer.getElementsByClassName('ql-editor')[0];
        let editorHtml = qlEditorElement.innerHTML;
        textarea.style.width = qlEditorElement.clientWidth + "px";
        textarea.style.height = qlEditorElement.clientHeight + "px";
        editorContainer.style.display = 'none';
        textarea.style.display = 'block';
        this.container.classList.add("disabled");
        this.quill.disable();
        textarea.value = pretty(editorHtml);
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
  options.format = options.format || [
    'bold',
    'italic',
    'link',
    'header',
    'list',
    'blockquote',
    'align',
    'image',
    'video',
    'divider'
  ];

  options.theme = 'snow';

  // Create editor in the newly created element with the correct options
  let editor = new Quill(editorElement, options);

  // Add current textarea value
  updateEditorContents(editor, textarea);
  editor.history.clear();

  // Add custom handlers for custom buttons
  let toolbar = editor.getModule('toolbar');

  let undo_btn = toolbar.container.getElementsByClassName("ql-undo")[0];

  // Sync all text changes to the textarea in the form
  editor.on(Quill.events.EDITOR_CHANGE, (eventName, ...args) => {
    // Do not sync changes when the editor is disabled.
    if (editor.isEnabled()) {
      if (eventName === Quill.events.TEXT_CHANGE)
        undo_btn.classList.remove("disabled");

      updateHtml(textarea, editor.container.getElementsByClassName('ql-editor')[0]);
    }
  });

  return editor;
}

window.makeEditor = makeEditor;