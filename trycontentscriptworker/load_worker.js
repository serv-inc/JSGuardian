console.log("load_worker loading")

function stringToWorker(code) {
  const blob = new Blob([code], {type: 'application/javascript'});
  return new Worker(URL.createObjectURL(blob));
}

let a = stringToWorker(`console.log("LogWorker started");
onmessage = function(e) {
  console.log("LogWorker received ");
  console.log(e);
}`);

a.onmessage = function(received) {
  console.log("load_worker received from worker ");
  console.log(received);
}

a.postMessage("hi");

console.log("load_worker done")
