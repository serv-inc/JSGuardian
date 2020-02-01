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
      if (val.data.type === "init done") {
        multi.terminate();
        done();
      }
    };
    multi.postMessage({type: "init", value: INIT});
  });

  it("scan does not match", done => {
    const multi = new Worker(FILE);
    multi.onmessage = function(val) {
      if (val.data.type === "scan done") {
        assert.equal(val.data.score, 0);
        multi.terminate();
        done();
      }
    };

    multi.postMessage({type: "init", value: INIT});
    multi.postMessage({type: "scan", value: "asdf"});
  });

  it("scan does match", done => {
    const multi = new Worker(FILE);
    multi.onmessage = function(val) {
      if (val.data.type === "scan done") {
        assert.equal(val.data.score, 3);
        multi.terminate();
        done();
      }
    };

    multi.postMessage({type: "init", value: INIT});
    multi.postMessage({type: "scan", value: "hello"});
  });
});
