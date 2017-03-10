"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */

chrome.runtime.sendMessage(document.body.innerText ||document.body.textContent);
