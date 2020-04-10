"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
// licensed under the MPL 2.0 by (github.com/serv-inc)

var lastSent = 0;
/** send at most this often (milliseconds) */
const MIN_INTERVAL = 500;

function send() {
  if ( Date.now() - MIN_INTERVAL > lastSent ) {
    chrome.runtime.sendMessage(
      document.body.innerText || document.body.textContent
    );
    lastSent = Date.now();
  }
}

send();

window.addEventListener("popstate", send);
