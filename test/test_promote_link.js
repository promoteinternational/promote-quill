'use strict';

import {PromoteLink} from '../lib/formats/promote_link';

const chai = require("chai");
const expect = chai.expect;

describe('PromoteLink', () => {
  it('add https if protocol is missing', () => {
    let subject = PromoteLink.create("example.org");
    expect(subject.getAttribute('href')).to.equal("https://example.org");
  });
});

