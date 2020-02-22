"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
// licensed under the MPL 2.0 by (github.com/serv-inc)

function send() {
  chrome.runtime.sendMessage(
    document.body.innerText || document.body.textContent
  );
}

send();

window.addEventListener("popstate", send());
