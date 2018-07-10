"use strict";
/* jshint esversion: 6, strict: global */
/* jshint loopfunc: true */
/* jshint laxbreak: true */
/* globals chrome */
/* globals setTimeout */
/* globals getSettings */
// licensed under the MPL 2.0 by (github.com/serv-inc)

/**
 * @fileoverview looks through all received text to find words, adds up
 * score, shows blocking page
 */

/** add URLS, and check whether added */
class BlockCache {
  constructor() {
    this._cache = [];
  }

  add(url) {
    if ( this.allow(url) ) {
      this._cache.push(url);
    }
  }

  allow(url) {
    return ! this._cache.includes(url);
  }
}
let blockCache = new BlockCache();

chrome.runtime.onMessage.addListener(function(pageText, sender, sendResponse) {
  if ( ! getSettings().whitelistRegExp.test(sender.url) ) {
    if ( blockCache.allow(sender.url) ) {
      scan(pageText, sender);
    } else {
      setBlockPage(sender, ['cached site']);
    }
  }
});

function setBlockPage(sender, phraseArray=['']) {
  chrome.tabs.update(
    sender.tab.id,
    {'url':
     chrome.extension.getURL('blockpage.html')
     + '?' + encodeURIComponent(sender.tab.url)
     + '&' + JSON.stringify(phraseArray)
    });
}

// td: this is non-testable due to i, score, ... above, maybe refactor
function scan(pageText, sender, score=0, matches=[],
              i=(getSettings().blockvals.length-1)) {
  score += _do_score(pageText, getSettings().blockvals[i], matches);

  if ( i === 0 && score > getSettings().limit ) {
    blockCache.add(sender.url);
    setBlockPage(sender, matches);
  }

  if ( i > 0 ) {
    setTimeout(function() {
      scan(pageText, sender, score, matches, i-1);
    }, 0);
  }
}

/** @return score of this blockObject on text */
function _do_score(pageText, blockObject, all_matches) {
  let tmp = pageText.match(RegExp(blockObject.value, "gi"));
  let matches = new Set();
  if ( tmp !== null ) {
    tmp.forEach((el) => {matches.add(el.toLowerCase());});
  }
  matches.forEach((el) => all_matches.push(el));
  return matches.size * blockObject.name;
}
