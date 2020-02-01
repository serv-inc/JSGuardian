let blocks;

onmessage = function(ev) {
  if (ev.data.type === "init") {
    blocks = ev.data.value;
    blocks.reverse();
    postMessage({type: "init done"});
  } else if (ev.data.type === "scan") {
    const pagetext = ev.data.value;
    let matches = [];
    let score = 0;
    blocks.forEach(block => {
      score += _do_score(pagetext, block, matches);
    });
    postMessage({type: "scan done", score: score});    
  }
};

function _do_score(pageText, blockObject, all_matches) {
  const matches = pageText.match(RegExp(blockObject.value, "gi"));
  if (matches === null) { return 0; }
  let set = new Set(matches.map(x => x.toLowerCase()));
  set.forEach((el) => all_matches.push(el));  // built-in?
  return set.size * blockObject.name;
}
