'use strict';

import {LinkParser} from '../lib/link_parser';

const chai = require("chai");
const expect = chai.expect;


describe('LinkParser.ensureProtocol', () => {
  it('add https if protocol is missing', () => {
    expect(LinkParser.ensureProtocol("example.org")).to.equal("https://example.org");
    expect(LinkParser.ensureProtocol("http://example.org")).to.equal("http://example.org");
    expect(LinkParser.ensureProtocol("https://example.org")).to.equal("https://example.org");
    expect(LinkParser.ensureProtocol("/example.org")).to.equal("https://example.org");
    expect(LinkParser.ensureProtocol("//example.org")).to.equal("https://example.org");
  });

  it('urls with too many slashes in the protocol should be fixed, keep protocol', () => {
    // This data is expected due to an old bug
    expect(LinkParser.ensureProtocol("ftp:///example.org")).to.equal("ftp://example.org");
    expect(LinkParser.ensureProtocol("ftp:////example.org")).to.equal("ftp://example.org");

    expect(LinkParser.ensureProtocol("http:///example.org")).to.equal("http://example.org");
    expect(LinkParser.ensureProtocol("http:////example.org")).to.equal("http://example.org");

    expect(LinkParser.ensureProtocol("https:///example.org")).to.equal("https://example.org");
    expect(LinkParser.ensureProtocol("https:////example.org")).to.equal("https://example.org");
    expect(LinkParser.ensureProtocol("https://///example.org")).to.equal("https://example.org");
  });
});
