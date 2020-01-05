if (typeof window === "undefined") {
  var Worker = require("tiny-worker");
  var assert = require("assert");
}

const FILE = "./addon/scorer.js";

it("scan initializes", done => {
  const scorer = new Worker(FILE);
  scorer.onmessage = function(val) {
    if (val.data[0] === "init done") {
      scorer.terminate();
      done();
    }
  };
  scorer.postMessage(["init", "hello"]);
  scorer.postMessage(["scan", "hello"]);
});

it("scan does match once", done => {
  const scorer = new Worker(FILE);
  scorer.onmessage = function(val) {
    if (val.data[0] === "scan done") {
      assert.equal(val.data[1], 1); //    val.data.should.equal(0);
      scorer.terminate();
      done();
    }
  };

  scorer.postMessage(["init", "hello"]);
  scorer.postMessage(["scan", "hello"]);
});

it("scan does not match", done => {
  const scorer = new Worker(FILE);
  scorer.onmessage = function(val) {
    if (val.data[0] === "scan done") {
      assert.equal(val.data[1], 0); //    val.data.should.equal(0);
      scorer.terminate();
      done();
    }
  };

  scorer.postMessage(["init", "hello"]);
  scorer.postMessage(["scan", "asdf"]);
});
