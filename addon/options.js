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
  let $set = chrome.extension.getBackgroundPage().getSettings();
  if ( ! $set.isManaged("limit") ) {
    $set.limit = getSmart(document.querySelector("#limit"));
  }
  if ( ! $set.isManaged("whitelist") ) {
    $set.whitelist = getSmart(document.querySelector("#whitelist"));
  }
  if ( ! $set.isManaged("blockpage") ) {
    $set.blockpage = getSmart(document.querySelector("#blockpage"));
  }
  if ( ! $set.isManaged("blockvals") ) {
    let blockvals = [];
    [2,3,5,10,20,25,30,40,50,60,70,80,90,100,120,130,150].forEach(function(id){
      blockvals.push({
        name: id,
        value: document.querySelector("#p" + id).value
      });
    });
    $set.blockvals = blockvals;
  }
  $set.save();
  window.close();
}


function restoreOptions() {
  if ( ! chrome ) {
    console.error("error on option initialization");
    initError = true;
    return;
  }
  initError = false;
  let $set = chrome.extension.getBackgroundPage().getSettings();
  document.querySelector("#limit").value = $set.limit;
  _disableIfManaged($set, "limit");
  document.querySelector("#whitelist").value = $set.whitelist;
  _disableIfManaged($set, "whitelist");
  document.querySelector("#blockpage").value = $set.blockpage;
  _disableIfManaged($set, "blockpage");
  $set.blockvals.forEach(function(el) {
    document.querySelector("#p" + el.name).value = el.value;
    _disableIfManaged($set, "blockvals", "p" + el.name);
  });
}

function setSmart(domElement, value) {
  if ( typeof value !== "undefined" ) {
    domElement.value = value;
  } else {
    domElement.value = "";
  }
}

// can break if sth defined "undefined"
function getSmart(domElement) {
  if ( domElement.value !== "" ) {
    return domElement.value;
  } else {
    return undefined;
  }
}

/** sets element to readonly if in managedStorage */
function _disableIfManaged($set, element, place=null) {
  place = place || element;
  if ( $set.isManaged(element) ) {
    document.querySelector("#" + place).disabled = true; // readOnly
  }
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
