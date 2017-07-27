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

chrome.runtime.onMessage.addListener(function(pageText, sender, sendResponse) {
    if ( ! settings.whitelistRegExp.test(sender.url) ) {
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
class Settings {
  /** initializes from managed, local storage. on first load from preset.json */
  constructor() {
    // this will fail if the _vars below are ever used in the real settings
    let _self = this;
    this._settings = {};
    this._managed = [];
    this._loaded = false;
    this._initialized = false;
    chrome.storage.managed.get(null, result => {
      for (let el in result) {
        if ( result.hasOwnProperty(el) ) {
          this._settings[el] = result[el];
          this._managed.push(el);
          Object.defineProperty(this, el,
                                { get: () => { return this._settings[el]; }});
        }
      }
      chrome.storage.local.get(null, result => {
        for (let el in result) {
          if ( el === "_initialized" ) {
            this._initialized = true;
            continue;
          }
          if ( result.hasOwnProperty(el) && ! this.isManaged(el) ) {
            this._settings[el] = result[el];
            Object.defineProperty(this, el,
                                  { get: () => { return this._settings[el]; },
                                    set: (x) => { this._settings[el] = x; }});
            // could also trigger a save of that value
          }
        }
        if ( ! this._initialized ) {
          this._loadFileSettings();
        } else {
          this.finish();
        }
      });
    });
  }


  get whitelistRegExp() {
    return RegExp(this.whitelist);
  }
  set whitelistRegExp(newRegExp) {
    if ( ! this._managed.includes("whitelist") ) {
      this.whitelist = newRegExp.toString().slice(1, -1);
    } else {
      console.err("tried to set managed whitelist property");
    }
  }


  isManaged(el) {
    return this._managed.includes(el);
  }


  save() {
    console.error("redo");
    let out = {};
    for (let el in this) {
      if ( realProperty(this, el)
           && ! this.isManaged(el) ) {
        out[el] = this[el];
      }
    }
    chrome.storage.local.set(out);
  }


  finish() {
    this._loaded = true;
    chrome.storage.onChanged.addListener(this.updateOptions);
  }


  updateOptions(changes, area) {
    for (let el in changes) {
      if ( changes.hasOwnProperty(el) ) {
        if ( area === "managed" ) {
          if ( ! self.isManaged(el) ) {
            self._managed.push(el);
          }
        } else if ( self.isManaged(el) ) {
          console.error("updated managed element");
          continue;
        }
        self[el] = changes[el].newValues;
      }
    }
  }


  _loadFileSettings() {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'preset.json', true);
    xobj.onreadystatechange = () => {
      if (xobj.readyState == 4 && xobj.status == "200") {
        let parsed = JSON.parse(xobj.responseText);
        for (let el in parsed) {
          if ( parsed.hasOwnProperty(el)
               && ! this.isManaged(el) ) {
            this[el] = parsed[el];
          }
        }
        chrome.storage.local.set({"_initialized": true});
        this.finish();
      }
    };
    xobj.send(null);
  }
};


let settings = new Settings();
/** @return settings to options page */
function getSettings() { return settings; }


/** @return true if property is a real data in object, not accessor */
function realProperty(object, property) {
  let descriptor = Object.getOwnPropertyDescriptor(object, property);
  return (object.hasOwnProperty(property)
          && Object.getOwnPropertyDescriptor(object, property)
                   .hasOwnProperty("value"));
}
