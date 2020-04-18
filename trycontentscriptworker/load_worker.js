console.log("load_worker loading")

let a = new Worker(chrome.runtime.getURL("./LogWorker.js"))

a.onmessage = function(received) { console.log("load_worker received from worker "); console.log(received) }

a.postMessage("hi")

console.log("load_worker done")
