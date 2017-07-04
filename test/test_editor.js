import {makeEditor} from '../lib/index';


describe('makeEditor', ()=>{
  it("should create an editor instance with the contents of the textarea", ()=>{
    let textarea = document.createElement('textarea');
    textarea.value = '<p>This is a test string</p><p>Just to see if information gets added</p>';
    document.body.appendChild(textarea);

    let quillEditor = makeEditor(textarea);
    let randomId = quillEditor.container.id.replace('editor-container-', '');
    let toolbar = quillEditor.getModule('toolbar');

    expect(textarea.style.display).to.equal('none');
    expect(textarea).to.eql(quillEditor.textarea);
    expect(quillEditor.container.id).to.equal('editor-container-' + randomId);
    expect(toolbar.container.id).to.equal('toolbar-container-' + randomId);
    expect(quillEditor.container.firstChild.innerHTML).to.equal('<p>This is a test string</p><p>Just to see if information gets added</p>');
  });
});
