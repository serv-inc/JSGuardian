if (typeof window === "undefined") {
  var Worker = require("tiny-worker");
  var assert = require("assert");
}

const FILE = "./addon/multi-scorer.js";
const INIT = [
  {
    name: 3,
    value: "hello"
  },
  {
    name: 4,
    value: "world"
  }
];

describe("multi scorer", _ => {
  it("scan initializes", done => {
    const multi = new Worker(FILE);
    multi.onmessage = function(val) {
      if (val.data[0] === "init done") {
        multi.terminate();
        done();
      }
    };
    multi.postMessage(["init", INIT]);
  });

  it("scan does match once", done => {
    const multi = new Worker(FILE);
    multi.onmessage = function(val) {
      if (val.data[0] === "scan done") {
        assert.equal(val.data[1], 3); //    val.data.should.equal(0);
        multi.terminate();
        done();
      }
    };
    multi.postMessage(["init", INIT]);
    multi.postMessage(["scan", "hello"]);
  });

  it("scan does not match", done => {
    const multi = new Worker(FILE);
    multi.onmessage = function(val) {
      if (val.data[0] === "scan done") {
        assert.equal(val.data[1], 0); //    val.data.should.equal(0);
        multi.terminate();
        done();
      }
    };

    multi.postMessage(["init", INIT]);
    multi.postMessage(["scan", "asdf"]);
  });
});
