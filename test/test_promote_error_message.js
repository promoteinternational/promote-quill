'use strict';

import PromoteErrorMessage from '../lib/formats/promote_error_message';

const chai = require("chai");
const expect = chai.expect;

describe('PromoteErrorMessage', () => {
  it('should render a text within a span', () => {
    const message = "RANDOM TEXT";

    let subject = PromoteErrorMessage.create({text: message});
    expect(subject.firstChild.innerText).to.equal(message);
    expect(subject.firstChild.nodeName).to.equal('SPAN');
  });
});


