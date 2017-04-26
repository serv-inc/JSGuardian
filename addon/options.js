"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
/* globals console */
/* globals document */
// licensed under the MPL 2.0 by (github.com/serv-inc)

const BASIC = 'mozilla.org|dansguardian.org';

function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    whitelist: document.querySelector("#whitelist").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#whitelist").value = result.whitelist || BASIC;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

    chrome.storage.local.get("whitelist", setCurrentChoice);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
