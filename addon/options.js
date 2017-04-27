"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
/* globals console */
/* globals document */
// licensed under the MPL 2.0 by (github.com/serv-inc)

const DEFAULTS = {
    "whitelist": 'mozilla.org|dansguardian.org',
    "limit": 160
};

function saveOptions(e) {
    e.preventDefault();
    chrome.storage.local.set({
        limit: document.querySelector("#limit").value,
        whitelist: document.querySelector("#whitelist").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#limit").value = result.limit || DEFAULTS.limit;
        document.querySelector("#whitelist").value = result.whitelist || DEFAULTS.whitelist;
    }

    chrome.storage.local.get(null, setCurrentChoice);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
