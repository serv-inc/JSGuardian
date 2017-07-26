"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
/* globals XMLHttpRequest */
/* globals setTimeout */
// licensed under the MPL 2.0 by (github.com/serv-inc)

/**
 * @fileoverview looks through all received text to find words, adds up
 * score, shows blocking page
 */

/** @return settings to options page */
function getSettings() { return settings; }
let settings = {};

chrome.runtime.onMessage.addListener(function(pageText, sender, sendResponse) {
    if ( ! settings.whitelist.test(sender.url) ) {
        scan(pageText, sender);
    }
});

// td: this is non-testable due to i, score, ... above, maybe refactor
function scan(pageText, sender, score=0, matches=[],
              i=(settings.blockvals.length-1)) {
    score += _do_score(pageText, settings.blockvals[i], matches);

    if ( score > settings.limit ) {
	chrome.tabs.update(sender.tab.id,
			   {'url': chrome.extension.getURL('popup.html')});
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

/* OPTIONS CODE */
var Settings = function() {
    // create data structures/names here
};

Settings.prototype.init() = function() {
    // nextaction
    // load first from managed, then from local storage
    // remember managed items, so that local updates do not override
}

chrome.storage.local.get(null, function(result) {
    settings.blockvals = result.blockvals;
    settings.limit = result.limit;
    settings.whitelist = result.whitelist && RegExp(result.whitelist);
    if ( ! settings.blockvals || ! settings.limit || ! settings.whitelist ) {
        loadFileSettings();
    }
});

function loadFileSettings() {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'preset.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            loadFromJSON(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadFromJSON(jsonObj) {
    let parsed = JSON.parse(jsonObj);
    settings.blockvals = settings.blockvals || parsed.blockvals;
    settings.limit = settings.limit || parsed.limit;
    settings.whitelist = settings.whitelist || RegExp(parsed.whitelist);
}

chrome.storage.onChanged.addListener(updateOptions);
function updateOptions(changes, area) {
    if ( changes ? 'whitelist' in changes : false ) {
        settings.whitelist = RegExp(changes.whitelist.newValue);
    }
    if ( changes ? 'limit' in changes : false ) {
        settings.limit = changes.limit.newValue;
    }
    if ( changes ? 'blockvals' in changes : false ) {
        settings.blockvals = changes.blockvals.newValue;
    }
}
