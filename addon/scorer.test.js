if (typeof window === "undefined") {
  var Worker = require("tiny-worker");
  var assert = require("assert");
}

const FILE = "./addon/scorer.js";

let scorer;

describe("scorer", () => {
  beforeEach(() => (scorer = new Worker(FILE)));
  afterEach(() => scorer.terminate());

  it("scan initializes", done => {
    scorer.onmessage = function(val) {
      if (val.data[0] === "init done") {
        done();
      }
    };
    scorer.postMessage(["init", "hello"]);
    scorer.postMessage(["scan", "hello"]);
  });

  describe("initialized", () => {
    beforeEach(() => scorer.postMessage(["init", "hello"]));

    it("scan does match once", done => {
      scorer.onmessage = function(val) {
        if (val.data[0] === "scan done") {
          assert.equal(val.data[1], 1); //    val.data.should.equal(0);
          done();
        }
      };

      scorer.postMessage(["scan", "hello"]);
    });

    it("scan does not match", done => {
      scorer.onmessage = function(val) {
        if (val.data[0] === "scan done") {
          assert.equal(val.data[1], 0); //    val.data.should.equal(0);
          done();
        }
      };

      scorer.postMessage(["scan", "asdf"]);
    });
  });
});
