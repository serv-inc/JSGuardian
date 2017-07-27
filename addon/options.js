"use strict";
/* jshint esversion: 6, strict: global */
/* globals chrome */
/* globals console */
/* globals document */
/* globals window */
// licensed under the MPL 2.0 by (github.com/serv-inc)
let initError = false;

function saveOptions(e) {
  e.preventDefault();
  if ( initError ) {
    console.error("did not save erroneous options");
    return;
  }
  let settings = chrome.extension.getBackgroundPage().getSettings();
  // later: dynamic loading of elements
  // for (let el in settings) {
  //   if ( settings.hasOwnProperty(el) ) {
  // check if is real property: Object.getOwnPropertyDescriptor(settings, el)
  //    if has '.value': real
  //    else: accessor
  // todo: check textfield readonly: managed, no further action
  //     this[el] = parsed[el];
  //   }
  // }
  if ( ! settings.isManaged("limit") ) {
    settings.limit = document.querySelector("#limit").value;
  }
  if ( ! settings.isManaged("whitelist") ) {
    settings.whitelist = document.querySelector("#whitelist").value;
  }
  if ( ! settings.isManaged("blockvals") ) {
    let blockvals = [];
    [2,3,5,10,20,25,30,40,50,60,70,80,90,100,120,130,150].forEach(function(id){
      blockvals.push({
        name: id,
        value: document.querySelector("#p" + id).value
      });
    });
    settings.blockvals = blockvals;
  }
  settings.save(settings); // todo: remove param possible?
  window.close();
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
  _disableIfManaged(settings, "limit");
  document.querySelector("#whitelist").value = settings.whitelist;
  _disableIfManaged(settings, "whitelist");
  settings.blockvals.forEach(function(el) {
    document.querySelector("#p" + el.name).value = el.value;
    _disableIfManaged(settings, "blockvals", "p" + el.name);
  });
}


/** sets element to readonly if in managedStorage */
function _disableIfManaged(settings, element, place=null) {
  place = place || element;
  if ( settings.isManaged(element) ) {
    document.querySelector("#" + place).disabled = true; // readOnly
  }
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
