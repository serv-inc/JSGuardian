const { parentPort, workerData } = require("worker_threads");
// console.log("data", workerData)
let regex;
//console.log(regex)

parentPort.on("message", json => {
  var [task, options] = JSON.parse(json);
  if (task === "init") {
    regex = RegExp(workerData, "gi");
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
