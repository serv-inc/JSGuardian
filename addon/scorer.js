let regex;
let times;

onmessage = function(e) {
  const [task, options] = e.data;
  if (task === "init") {
    regex = RegExp(options.regex, options.flags);
    times = options.times;
    postMessage(["init done"]);
  } else if (task === "scan") {
    const matches = options.match(regex);
    if (matches === null) {
      postMessage(["scan done", 0]);
    } else {
      postMessage(["scan done", matches.length * times]);
    }
  } else {
    throw new Error("wut: " + task);
  }
};
