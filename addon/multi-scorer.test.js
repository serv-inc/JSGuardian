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
const SENDER = { tab: { id: 1234 }, url: "url" };

describe("multi scorer", _ => {
  it("scan initializes", done => {
    const multi = new Worker(FILE);
    multi.onmessage = function(val) {
      if (val.data.type === "init done") {
        multi.terminate();
        done();
      }
    };
    multi.postMessage({ type: "init", value: INIT });
  });

  it("scan does not match", done => {
    const multi = new Worker(FILE);
    multi.onmessage = function(val) {
      if (val.data.type === "scan done") {
        assert.equal(val.data.score, 0);
        assert.deepEqual(val.data.sender, SENDER);
        assert.deepEqual(val.data.matches, []);
        multi.terminate();
        done();
      }
    };

    multi.postMessage({ type: "init", value: INIT });
    multi.postMessage({ type: "scan", value: "asdf", sender: SENDER });
  });

  it("scan does match", done => {
    const multi = new Worker(FILE);
    multi.onmessage = function(val) {
      if (val.data.type === "scan done") {
        assert.equal(val.data.score, 3);
        assert.deepEqual(val.data.sender, SENDER);
        assert.deepEqual(val.data.matches, ["hello"]);
        multi.terminate();
        done();
      }
    };

    multi.postMessage({ type: "init", value: INIT });
    multi.postMessage({ type: "scan", value: "hello", sender: SENDER });
  });
});
