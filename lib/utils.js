export function updateEditorContents(editor, textarea) {
  editor.clipboard.dangerouslyPasteHTML(textarea.value);
}

export function addTooltip(options, name, defaultString, os, defaultKeyBinding, macKeyBinding, winKeyBinding) {
  let returnString = (options.tooltips[name] || defaultString);

  if (os) {
    let keyBinding = defaultKeyBinding;
    if (os == 'mac')
      keyBinding = macKeyBinding;

    if (os == 'win' && winKeyBinding)
      keyBinding = winKeyBinding;

    returnString += (" " + keyBinding);
  }

  return returnString;
}

export function addButton(options, name, button_options = {}) {
  let tooltip_name = name + (button_options.value ? ("_" + button_options.value) : "");

  return '<button class="ql-' + name + (button_options.disabled ? ' disabled' : '') + '" type="button" title="' + options.tooltips[tooltip_name] + '"' + (button_options.value ? ' value="' + button_options.value + '"' : '') + '></button>';
}

export function addSelect(options, name, select_options) {
  let html = '<select class="ql-'+ name + '" title="' + options.tooltips[name] + '">';
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

export function updateHtml(textarea, editorContainer) {
  let evt = document.createEvent("HTMLEvents");

  textarea.value = editorContainer.innerHTML;
  evt.initEvent("change", false, true);
  textarea.dispatchEvent(evt);
}
