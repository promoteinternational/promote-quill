export function updateEditorContents(editor, textarea) {
  editor.clipboard.dangerouslyPasteHTML(textarea.value);
}

const defaultTooltips = {
  bold: {
    defaultText: 'Toggle bold style',
    defaultKeys: {
      win: '(ctrl+b)',
      lin: '(ctrl+b)',
      mac: '(cmd+b)'
    }
  },
  italic: {
    defaultText: 'Toggle emphasis',
    defaultKeys: {
      win: '(ctrl+i)',
      lin: '(ctrl+i)',
      mac: '(cmd+i)'
    }
  },
  link: {
    defaultText: 'Add / edit link',
    defaultKeys: {
      win: '(ctrl+k)',
      lin: '(ctrl+k)',
      mac: '(cmd+k)'
    }
  },
  header: {
    defaultText: 'Select header type'
  },
  ordered_list: {
    defaultText: 'Wrap in ordered list'
  },
  bullet_list: {
    defaultText: 'Wrap in bullet list'
  },
  blockquote: {
    defaultText: 'Wrap in block quote'
  },
  align: {
    defaultText: 'Select alignment'
  },
  video: {
    defaultText: 'Insert video'
  },
  divider: {
    defaultText: 'Insert divider'
  },
  undo: {
    defaultText: 'Undo',
    defaultKeys: {
      win: '(ctrl+z)',
      lin: '(ctrl+z)',
      mac: '(cmd+z)'
    }
  },
  redo: {
    defaultText: 'Redo',
    defaultKeys: {
      win: '(ctrl+y)',
      lin: '(ctrl+shift+z)',
      mac: '(cmd+shift+z)'
    }
  },
  clean: {
    defaultText: 'Remove all formatting on selected text'
  },
  showcode: {
    defaultText: 'Toggle code view'
  }
};

function addButton(tooltip, name, button_options = {}) {
  return '<button class="ql-' + name + (button_options.disabled ? ' disabled' : '') + '" type="button" title="' + tooltip + '"' + (button_options.value ? ' value="' + button_options.value + '"' : '') + '></button>';
}

function addSelect(tooltip, name, select_options) {
  let html = '<select class="ql-'+ name + '" title="' + tooltip + '">';
  for (let i=0; i < select_options.length; i++) {
    let option = select_options[i];
    if (select_options[i])
      html += '<option value="' + select_options[i] + '"></option>';
    else
      html += '<option selected></option>';
  }
  html += '</select>';

  return html;
}

function addButtons(toolsMap, os) {
  let html = "";

  for (let name of Object.keys(toolsMap)) {
    let options;
    let tooltip = typeof toolsMap[name] == "string" ? toolsMap[name] : defaultTooltips[name].defaultText;
    
    if (defaultTooltips[name].defaultKeys)
      tooltip += " " + defaultTooltips[name].defaultKeys[os];

    if (['link', 'redo', 'undo'].indexOf(name) != -1) {
      options = {disabled: true};
      html += addButton(tooltip, name, options);
    } else switch(name) {
      case 'align':
        options = [null, 'center', 'right'];
        html += addSelect(tooltip, name, options);
        break;
      case 'header':
        options = [1, 2, 3, null];
        html += addSelect(tooltip, name, options);
        break;
      case 'ordered_list':
        name = 'list';
        options = {value: "ordered"};
        html += addButton(tooltip, name, options);
        break;
      case 'bullet_list':
        name = 'list';
        options = {value: "bullet"};
        html += addButton(tooltip, name, options);
        break;
      default:
        html += addButton(tooltip, name, {});
    }
  }

  return html;
}

export function createToolbar(editorTools, os) {
  let toolbarHtml = "";

  for (let item of editorTools) {
    toolbarHtml += '<span class="ql-formats">';
    toolbarHtml += addButtons(item, os);
    toolbarHtml += '</span>';
  }

  return toolbarHtml;
}