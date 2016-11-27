"use strict";
/**
* @fileoverview alters search engine requests to use safe search
*/
const {Cc, Ci} = require("chrome");
let observerService = Cc["@mozilla.org/observer-service;1"]
    .getService(Ci.nsIObserverService);
var ioService = Cc["@mozilla.org/network/io-service;1"]
    .getService(Ci.nsIIOService);

function Search() {
    this.init();
}
// google, yahoo, bing due to =Safe Search= addon by Mike Kaply
Search.prototype.observe = function(subject, topic, data) {
    if ( topic == "http-on-modify-request" ) {
        let http_channel = subject.QueryInterface(Ci.nsIHttpChannel);
        let uri = http_channel.URI;

        if ( uri.host.indexOf("google.") != -1 ) {
            if (/^(\/custom|\/search|\/images\/complete)/.test(uri.path)) {
                redirectIfNeeded(http_channel, "safe=strict");
            }
        } else if ( uri.host.indexOf("search.yahoo.") != -1 ) {
            if (/(\/search)/.test(uri.path)) {
                redirectIfNeeded(http_channel, "vm=r");
            }
        } else if ( uri.host.indexOf("bing.") != -1 ) {
            if (/^(\/search|\/videos|\/images|\/news)/.test(uri.path)) {
                redirectIfNeeded(http_channel, "adlt=strict");
            }
        } else if ( uri.host.indexOf("duckduckgo.") != -1 ) {
            if ( uri.path.indexOf("q=") != -1 ) {
                redirectIfNeeded(http_channel, "kp=1");
            }
        } else if ( uri.host.indexOf("youtube") != -1 ) {
            http_channel.setRequestHeader("YouTube-Restrict", "Moderate", false);
        }
        // td: vimeo cookie
    }
}

Search.prototype.init = function() {
    observerService.addObserver(this, "http-on-modify-request", false);
};

Search.prototype.stop = function() {
    observerService.removeObserver(this, "http-on-modify-request");
};

exports.Search = Search;

let redirectIfNeeded = function(http_channel, needed_part) {
    if (http_channel.URI.spec.indexOf(needed_part) == -1) {
        http_channel.redirectTo(ioService.newURI(
            http_channel.URI.spec + "&" + needed_part, null, null));
    }
};

