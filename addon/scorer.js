const { parentPort, workerData } = require("worker_threads");
// console.log("data", workerData)
let regex;
//console.log(regex)

parentPort.on("message", json => {
  var [task, options] = JSON.parse(json);
  if (task === "init") {
    regex = RegExp(workerData, "gi");
  } else if (task === "scan") {
//    console.log("r2", regex)
    parentPort.postMessage(options.match(regex).length)
  } else {
    throw new Error("wut: " + task);
  }
});
