let blocks;

onmessage = function(ev) {
  const [task, options] = ev.data;
  if (task === "init") {
    blocks = options;
    blocks.reverse();
    postMessage(["init done"]);
  } else if (task === "scan") {
    const pagetext = options;
    let matches = [];
    let score = 0;
    blocks.forEach(block => {
//      console.log(block);
      score += _do_score(pagetext, block, matches);
    });
    postMessage(["scan done", score]);    
  }
};

function _do_score(pageText, blockObject, all_matches) {
//  console.log(1);
  const matches = pageText.match(RegExp(blockObject.value, "gi"));
  if (matches === null) { return 0; }
  let set = new Set(matches.map(x => x.toLowerCase()));
//  console.log(set);
  set.forEach((el) => all_matches.push(el));  // built-in?
  return set.size * blockObject.name;
}
