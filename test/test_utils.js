const chai = require("chai");
const expect = chai.expect;

import {addButton, addButtons, addSelect, createToolbar, addFormatsAndHandlers} from "../lib/utils";

describe('addButton', () => {
  it('should return correctly formatted button without options', () => {
    const html = addButton("This is a tooltip", "bold");

    expect(html).to.equal('<button class="ql-bold" type="button" title="This is a tooltip"></button>');
  });
  it('should return button with disabled class if option set', () => {
    const html = addButton("This is a tooltip", "bold", {disabled: true});

    expect(html).to.equal('<button class="ql-bold disabled" type="button" title="This is a tooltip"></button>')
  });
  it('should return button with value set if option set', () => {
    const html = addButton("This is a tooltip", "bold", {value: "false"});

    expect(html).to.equal('<button class="ql-bold" type="button" title="This is a tooltip" value="false"></button>');
  });
  it('should add disabled and value if both options set', () => {
    const html = addButton("This is a tooltip", "bold", {disabled: true, value: "false"});

    expect(html).to.equal('<button class="ql-bold disabled" type="button" title="This is a tooltip" value="false"></button>');
  });
});

describe('addSelect', () => {
  it('should return correctly formatted select with default', () => {
    const html = addSelect("This is a tooltip", "header", [1, 2, 3, null]);

    expect(html).to.equal('<select class="ql-header" title="This is a tooltip"><option value="1"></option><option value="2"></option><option value="3"></option><option selected></option></select>');
  });

  it('should return correctly formatted select without default', () => {
    const html = addSelect("This is a tooltip", "header", [1, 2, 3]);

    expect(html).to.equal('<select class="ql-header" title="This is a tooltip"><option value="1"></option><option value="2"></option><option value="3"></option></select>');
  });
});

describe('addButtons', () => {
  it('should add defaults correctly - windows', () => {
    const html = addButtons({bold: true, italic: true, link: true, header: true, ordered_list: true, bullet_list: true, blockquote: true, align: true, video: true, divider:true, undo: true, redo: true, clean: true, showcode: true}, 'win');

    expect(html).to.equal(
      '<button class="ql-bold" type="button" title="Toggle bold style (ctrl+b)"></button>' +
      '<button class="ql-italic" type="button" title="Toggle emphasis (ctrl+i)"></button>' +
      '<button class="ql-link disabled" type="button" title="Add / edit link (ctrl+k)"></button>' +
      '<select class="ql-header" title="Select header type"><option value="1"></option><option value="2"></option><option value="3"></option><option selected></option></select>' +
      '<button class="ql-list" type="button" title="Wrap in ordered list" value="ordered"></button>' +
      '<button class="ql-list" type="button" title="Wrap in bullet list" value="bullet"></button>' +
      '<button class="ql-blockquote" type="button" title="Wrap in block quote"></button>' +
      '<select class="ql-align" title="Select alignment"><option selected></option><option value="center"></option><option value="right"></option></select>' +
      '<button class="ql-video" type="button" title="Insert video"></button>' +
      '<button class="ql-divider" type="button" title="Insert divider"></button>' +
      '<button class="ql-undo disabled" type="button" title="Undo (ctrl+z)"></button>' +
      '<button class="ql-redo disabled" type="button" title="Redo (ctrl+y)"></button>' +
      '<button class="ql-clean" type="button" title="Remove all formatting on selected text"></button>' +
      '<button class="ql-showcode" type="button" title="Toggle code view"></button>'
    );
  });
  it('should add defaults correctly - linux', () => {
    const html = addButtons({bold: true, italic: true, link: true, header: true, ordered_list: true, bullet_list: true, blockquote: true, align: true, video: true, divider:true, undo: true, redo: true, clean: true, showcode: true}, 'lin');

    expect(html).to.equal(
      '<button class="ql-bold" type="button" title="Toggle bold style (ctrl+b)"></button>' +
      '<button class="ql-italic" type="button" title="Toggle emphasis (ctrl+i)"></button>' +
      '<button class="ql-link disabled" type="button" title="Add / edit link (ctrl+k)"></button>' +
      '<select class="ql-header" title="Select header type"><option value="1"></option><option value="2"></option><option value="3"></option><option selected></option></select>' +
      '<button class="ql-list" type="button" title="Wrap in ordered list" value="ordered"></button>' +
      '<button class="ql-list" type="button" title="Wrap in bullet list" value="bullet"></button>' +
      '<button class="ql-blockquote" type="button" title="Wrap in block quote"></button>' +
      '<select class="ql-align" title="Select alignment"><option selected></option><option value="center"></option><option value="right"></option></select>' +
      '<button class="ql-video" type="button" title="Insert video"></button>' +
      '<button class="ql-divider" type="button" title="Insert divider"></button>' +
      '<button class="ql-undo disabled" type="button" title="Undo (ctrl+z)"></button>' +
      '<button class="ql-redo disabled" type="button" title="Redo (ctrl+shift+z)"></button>' +
      '<button class="ql-clean" type="button" title="Remove all formatting on selected text"></button>' +
      '<button class="ql-showcode" type="button" title="Toggle code view"></button>'
    );
  });
  it('should add defaults correctly - mac', () => {
    const html = addButtons({bold: true, italic: true, link: true, header: true, ordered_list: true, bullet_list: true, blockquote: true, align: true, video: true, divider:true, undo: true, redo: true, clean: true, showcode: true}, 'mac');

    expect(html).to.equal(
      '<button class="ql-bold" type="button" title="Toggle bold style (cmd+b)"></button>' +
      '<button class="ql-italic" type="button" title="Toggle emphasis (cmd+i)"></button>' +
      '<button class="ql-link disabled" type="button" title="Add / edit link (cmd+k)"></button>' +
      '<select class="ql-header" title="Select header type"><option value="1"></option><option value="2"></option><option value="3"></option><option selected></option></select>' +
      '<button class="ql-list" type="button" title="Wrap in ordered list" value="ordered"></button>' +
      '<button class="ql-list" type="button" title="Wrap in bullet list" value="bullet"></button>' +
      '<button class="ql-blockquote" type="button" title="Wrap in block quote"></button>' +
      '<select class="ql-align" title="Select alignment"><option selected></option><option value="center"></option><option value="right"></option></select>' +
      '<button class="ql-video" type="button" title="Insert video"></button>' +
      '<button class="ql-divider" type="button" title="Insert divider"></button>' +
      '<button class="ql-undo disabled" type="button" title="Undo (cmd+z)"></button>' +
      '<button class="ql-redo disabled" type="button" title="Redo (cmd+shift+z)"></button>' +
      '<button class="ql-clean" type="button" title="Remove all formatting on selected text"></button>' +
      '<button class="ql-showcode" type="button" title="Toggle code view"></button>'
    );
  });

  it('should add tooltip correctly if set', () => {
    const html = addButtons({bold: "Toggle to bold style"}, "lin");

    expect(html).to.equal(
      '<button class="ql-bold" type="button" title="Toggle to bold style (ctrl+b)"></button>'
    );
  });
});

describe('createToolbar', () => {
  it('should add one group of buttons', () => {
    const html = createToolbar([{bold:true, italic: true, link: true}], "lin");

    expect(html).to.equal(
      '<span class="ql-formats">' +
      '<button class="ql-bold" type="button" title="Toggle bold style (ctrl+b)"></button>' +
      '<button class="ql-italic" type="button" title="Toggle emphasis (ctrl+i)"></button>' +
      '<button class="ql-link disabled" type="button" title="Add / edit link (ctrl+k)"></button>' +
      '</span>'
    )
  });
  it('should add two groups of buttons', () => {
    const html = createToolbar([{bold:true, italic: true, link: true}, {undo: true, redo: true, clean: true, showcode: true}], "lin");

    expect(html).to.equal(
      '<span class="ql-formats">' +
      '<button class="ql-bold" type="button" title="Toggle bold style (ctrl+b)"></button>' +
      '<button class="ql-italic" type="button" title="Toggle emphasis (ctrl+i)"></button>' +
      '<button class="ql-link disabled" type="button" title="Add / edit link (ctrl+k)"></button>' +
      '</span>' +
      '<span class="ql-formats">' +
      '<button class="ql-undo disabled" type="button" title="Undo (ctrl+z)"></button>' +
      '<button class="ql-redo disabled" type="button" title="Redo (ctrl+shift+z)"></button>' +
      '<button class="ql-clean" type="button" title="Remove all formatting on selected text"></button>' +
      '<button class="ql-showcode" type="button" title="Toggle code view"></button>' +
      '</span>'
    )
  });

  it('should add one group of buttons with tooltips', () => {
    const html = createToolbar([{bold:"Tooltip 1", italic: "Tooltip 2", link: "Tooltip 3"}], "lin");

    expect(html).to.equal(
      '<span class="ql-formats">' +
      '<button class="ql-bold" type="button" title="Tooltip 1 (ctrl+b)"></button>' +
      '<button class="ql-italic" type="button" title="Tooltip 2 (ctrl+i)"></button>' +
      '<button class="ql-link disabled" type="button" title="Tooltip 3 (ctrl+k)"></button>' +
      '</span>'
    )
  });
});

describe('addFormatsAndHandlers', () => {
  it('empty editor tools should add default formats', () => {
    const options = {
      modules: {
        toolbar: {
          handlers: {
          }
        }
      }
    }, editorTools = [{}];
    addFormatsAndHandlers(options, editorTools);

    expect(options.formats).to.eql(
      ['alt', 'height', 'width', 'image']
    );
    expect(options.modules.toolbar.handlers).to.eql({})
  });
});