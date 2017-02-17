import Quill from "quill";
import Hr from './formats/hr';
import {PromoteVideo} from './formats/promote_video';
import {defaultHandlers} from './formats/handlers';
import {createToolbar, updateEditorContents} from './utils';

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

const defaultToolbar = [
  {'bold': true, 'italic': true, 'link': true},
  {'header': true},
  {'ordered_list': true, 'bullet_list': true, 'blockquote': true},
  {'align': true},
  {'video': true, 'divider':true},
  {'undo': true, 'redo': true, 'clean': true, 'showcode': true}
];

export function makeEditor(textarea, editorOptions = {}, editorTools=defaultToolbar) {
  let os = "win";
  let editorId = parseInt(Math.random() * 10000);
  let options = editorOptions;
  options.modules = {
    toolbar: {
      handlers: {
      }
    }
  };

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
  toolbarElement.innerHTML = createToolbar(editorTools, os);

  // Add our default toolbar
  options.modules.toolbar.container = "#" + toolbarElement.id;

  // Make sure only our custom formats are used
  options.formats = [
    // Add attributes that we want to be able to parse (used on images and video links)
    'alt',
    'height',
    'width',
    'image'
  ];

  for (let i=0; i < editorTools.length; i++) {
    let itemKeys = Object.keys(editorTools[i]);
    for (let keyIndex=0; keyIndex < itemKeys.length; keyIndex++) {
      let key = itemKeys[keyIndex];
      if (['ordered_list', 'bullet_list'].indexOf(key) != -1)
        key = 'list';

      if (options.formats.indexOf(key) == -1) {
        options.formats.push(key);
        if (Object.keys(defaultHandlers).indexOf(key) != -1)
          options.modules.toolbar.handlers[key] = defaultHandlers[key];
      }
    }
  }

  options.theme = 'snow';

  // Create editor in the newly created element with the correct options
  let editor = new Quill(editorElement, options);

  // Add current textarea value
  updateEditorContents(editor, textarea);
  editor.history.clear();

  editor.textarea = textarea;

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

      // Update textarea and signal change
      textarea.value = editor.container.firstChild.innerHTML;
      editor.emitter.emit("change");
    }
  });

  return editor;
}

window.makeEditor = makeEditor;