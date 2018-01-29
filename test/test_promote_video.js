'use strict';

import {PromoteVideo} from '../lib/formats/promote_video';

const chai = require("chai");
const expect = chai.expect;

describe('PromoteVideo', () => {
  it('add https if protocol is missing', () => {
    let subject = PromoteVideo.create("example.org");
    expect(subject.firstChild.getAttribute('src')).to.equal("https://example.org");
  });
});


