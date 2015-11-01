const assert = require('power-assert');

describe("karma and mocha testing", () => {

  it ("return hello", (done) => {

    assert(hello() === "hello");

    done();
  });
});
