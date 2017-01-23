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

export function addButton(options, name, value) {
  let tooltip_name = name;
  if (value)
    tooltip_name = tooltip_name + "_" + value;

  return '<button class="ql-' + name + '" type="button" title="' + options.tooltips[tooltip_name] + '"' + (value ? ' value="' + value + '"' : '') + '></button>';
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

export function updateHtml(textarea, editorElement) {
  let evt = document.createEvent("HTMLEvents");

  textarea.innerHTML = editorElement.childNodes[0].innerHTML;
  evt.initEvent("change", false, true);
  textarea.dispatchEvent(evt);
}
