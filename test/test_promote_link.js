'use strict';

import {PromoteLink, ensureProtocol} from '../lib/formats/promote_link';

const chai = require("chai");
const expect = chai.expect;

describe('ensureProtocol', () => {
  it('add https if protocol is missing', () => {
    //expect(ensureProtocol("asdf")).to.equal("https://asdf");
    expect(ensureProtocol("example.org")).to.equal("https://example.org");
    expect(ensureProtocol("http://example.org")).to.equal("http://example.org");
    expect(ensureProtocol("https://example.org")).to.equal("https://example.org");
    expect(ensureProtocol("/example.org")).to.equal("https://example.org");
    expect(ensureProtocol("//example.org")).to.equal("https://example.org");
  });

  it('urls with too many slashes in the protocol should be fixed, keep protocol', () => {
    // This data is expected due to an old bug
    expect(ensureProtocol("ftp:///example.org")).to.equal("ftp://example.org");
    expect(ensureProtocol("ftp:////example.org")).to.equal("ftp://example.org");

    expect(ensureProtocol("http:///example.org")).to.equal("http://example.org");
    expect(ensureProtocol("http:////example.org")).to.equal("http://example.org");

    expect(ensureProtocol("https:///example.org")).to.equal("https://example.org");
    expect(ensureProtocol("https:////example.org")).to.equal("https://example.org");
    expect(ensureProtocol("https://///example.org")).to.equal("https://example.org");
  });
});
