"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
/* globals console */
/* globals document */
// licensed under the MPL 2.0 by (github.com/serv-inc)
let initError = false;

function saveOptions(e) {
    e.preventDefault();
    if ( initError ) {
        console.error("did not save erroneous options");
        return;
    }
    var settings = {
        blockvals: [],
        limit: document.querySelector("#limit").value,
        whitelist: document.querySelector("#whitelist").value.toString().slice(1, -1)
    };
    let old_settings = chrome.extension.getBackgroundPage().getSettings();
    [2,3,5,10,20,25,30,40,50,60,70,80,90,100,120,130,150].forEach(function(id){
        settings.blockvals.push({
            name: id,
            value: document.querySelector("#p" + id).value
        });
    });
    chrome.storage.local.set(settings);
}

function restoreOptions() {
    if ( ! chrome ) {
        console.error("error on option initialization");
        initError = true;
        return;
    }
    initError = false;
    let settings = chrome.extension.getBackgroundPage().getSettings();
    document.querySelector("#limit").value = settings.limit;
    document.querySelector("#whitelist").value = settings.whitelist;
    settings.blockvals.forEach(function(el) {
        document.querySelector("#p" + el.name).value = el.value;
    });
    
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
