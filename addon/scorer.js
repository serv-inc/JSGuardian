// nodejs code to use same api as web workers
if (isNode()) {
  var { parentPort } = require("worker_threads");
}
if (typeof onmessage === "undefined" && isNode()) {
  var onmessage = function(action) {
    parentPort.on("message", action);
  };
}
if (typeof postMessage === "undefined" && isNode()) {
  var postMessage = function(message) {
    parentPort.postMessage(message);
  };
}

let regex;

onmessage(json => {
  var [task, options] = JSON.parse(json);
  if (task === "init") {
    regex = RegExp(options, "gi");
  } else if (task === "scan") {
    const matches = options.match(regex);
    if (matches === null) {
      parentPort.postMessage(0);
    } else {
      parentPort.postMessage(matches.length);
    }
  } else {
    throw new Error("wut: " + task);
  }
});

function isNode() {
  return (
    typeof process !== "undefined" &&
    process.release.name.search(/node|io.js/) !== -1
  );
}
