"use strict";
/* jshint esversion: 6, strict: global, loopfunc: true, laxbreak: true */
/* globals chrome, getSettings */
// licensed under the MPL 2.0 by (github.com/serv-inc)

/**
 * @fileoverview looks through all received text to find words, adds up
 * score, shows blocking page
 */
const URL_RE = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;

const BLOCKPAGE_URL = "blockpage.html";
const NO_SCAN = /extension:/;

let scanner = new Worker("./multi-scorer.js");
scanner.onmessage = function(val) {
  if (val.data.type === "scan done") {
    if (val.data.score > getSettings().limit) {
      setBlockPage(val.data.sender, val.data.matches, ">= " + val.data.score);
    }
  } else if (val.data.type === "init done") {
    // all's well
  } else {
    console.error("error scanning ", val);
  }
};

/** add URLS, and check whether added */
class BlockCache {
  constructor() {
    this._cache = [];
  }

  add(url) {
    if (this.allow(url)) {
      this._cache.push(url);
    }
  }

  allow(url) {
    return !this._cache.includes(url);
  }
}
let blockCache = new BlockCache();

chrome.runtime.onMessage.addListener(function(pageText, sender) {
  if (
    !getSettings().whitelistRegExp.test(sender.url) &&
    !NO_SCAN.test(sender.url)
  ) {
    if (blockCache.allow(sender.url)) {
      scan(pageText, sender);
    } else {
      setBlockPage(sender, ["cached site"]);
    }
  }
});

// how to validate blockpage? new URL(blockpage) is not available?
function setBlockPage(sender, phraseArray = [""], limit = "???") {
  if (NO_SCAN.test(sender.url)) {
    return;
  }

  if (blockCache.allow(sender.url)) {
    blockCache.add(sender.url);
  }

  var blockpage;
  if (isValid(getSettings().blockpage)) {
    blockpage = getSettings().blockpage;
  } else {
    blockpage =
      chrome.extension.getURL(BLOCKPAGE_URL) +
      "?" +
      encodeURIComponent(sender.tab.url) +
      "&" +
      encodeURIComponent(JSON.stringify(phraseArray)) +
      "&" +
      limit;
  }
  chrome.tabs.update(sender.tab.id, { url: blockpage });
}

function isValid(urlString) {
  return typeof urlString === "string" && URL_RE.test(urlString);
}

function scan(pageText, sender) {
  scanner.postMessage({ type: "scan", value: pageText, sender: sender });
}

function settingsLoaded() {
  scanner.postMessage({ type: "init", value: getSettings().blockvals });
}

const set = getSettings(settingsLoaded);
