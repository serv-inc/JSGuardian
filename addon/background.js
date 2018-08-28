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
const URL_RE = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

const BLOCKPAGE_URL = 'blockpage.html';

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
  if ( ! getSettings().whitelistRegExp.test(sender.url)
       && ! sender.url.includes(BLOCKPAGE_URL) ) {
    if ( blockCache.allow(sender.url) ) {
      scan(pageText, sender);
    } else {
      setBlockPage(sender, ['cached site']);
    }
  }
});

// how to validate blockpage? new URL(blockpage) is not available?
function setBlockPage(sender, phraseArray=[''], limit="???") {
  var blockpage;
  if (isValid(getSettings().blockpage)) {
    blockpage = getSettings().blockpage;
  } else {
    blockpage = chrome.extension.getURL(BLOCKPAGE_URL)
      + '?' + encodeURIComponent(sender.tab.url)
      + '&' + encodeURIComponent(JSON.stringify(phraseArray))
      + '&' + limit;
  }
  chrome.tabs.update(sender.tab.id, {'url': blockpage});
}

function isValid(urlString) {
  return typeof urlString === "string" && URL_RE.test(urlString);
}

// td: this is non-testable due to i, score, ... above, maybe refactor
function scan(pageText, sender, score=0, matches=[],
              i=(getSettings().blockvals.length-1)) {
  score += _do_score(pageText, getSettings().blockvals[i], matches);

  if ( score > getSettings().limit ) {
    blockCache.add(sender.url);
    if ( i > 0 ) {
      score = ">=" + score;
    }
    setBlockPage(sender, matches, score);
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
