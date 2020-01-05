let regex;

onmessage = function(e) {
  var [task, options] = e.data;
  if (task === "init") {
    regex = RegExp(options, "gi");
    postMessage(["init done"]);
  } else if (task === "scan") {
    const matches = options.match(regex);
    if (matches === null) {
      postMessage(["scan done", 0]);
    } else {
      postMessage(["scan done", matches.length]);
    }
  } else {
    throw new Error("wut: " + task);
  }
};
