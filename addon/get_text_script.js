"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
/* globals document */
// licensed under the MPL 2.0 by (github.com/serv-inc)

chrome.runtime.sendMessage(document.body.innerText ||document.body.textContent);
