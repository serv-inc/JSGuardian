console.log("load_worker loading")

function getPageText() {
  var string = document.body.innerText || document.body.textContent;
  return new TextEncoder().encode(string);
}
//  new TextDecoder('utf-8').decode(uint8array); //"hiiiiiii"

function stringToWorker(code) {
  const blob = new Blob([code], {type: 'application/javascript'});
  return new Worker(URL.createObjectURL(blob));
}

let worker = stringToWorker(`console.log("LogWorker started");
onmessage = function(e) {
  console.log("LogWorker received ");
  console.log(e);
}`);

worker.onmessage = function(received) {
  console.log("load_worker received from worker ");
  console.log(received);
}

worker.postMessage('hi');//, [getPageText]);

console.log("load_worker done")
