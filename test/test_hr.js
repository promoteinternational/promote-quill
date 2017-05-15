'use strict';

import Hr from '../lib/formats/hr';

const chai = require("chai");
const expect = chai.expect;

describe('Hr', () => {
  it('Hr should have the correct names', () => {
    expect(Hr.blotName).to.equal("divider");
    expect(Hr.tagName).to.equal("hr");
  });
});