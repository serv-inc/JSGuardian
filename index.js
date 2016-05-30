"use strict";
const Simple = require('sdk/simple-prefs');

Simple.on("limit", onPrefChange);
Simple.on("multi", onPrefChange);

let mod = create();

function create(limit) {
    return require("sdk/page-mod").PageMod({
    include: /.*/,
    attachTo: "top",
    contentScriptFile: "./pf.js",
    contentScriptOptions: {
        limit: Simple.prefs.limit,
        regexes: [m(Simple.prefs.point2), m(Simple.prefs.point3),
                  m(Simple.prefs.point5), m(Simple.prefs.point10),
                  m(Simple.prefs.point20), m(Simple.prefs.point25),
                  m(Simple.prefs.point30), m(Simple.prefs.point40),
                  m(Simple.prefs.point50), m(Simple.prefs.point60),
                  m(Simple.prefs.point70), m(Simple.prefs.point80),
                  m(Simple.prefs.point90), m(Simple.prefs.point100),
                  m(Simple.prefs.point120), m(Simple.prefs.point130),
                  m(Simple.prefs.point150)],
        regexValues: [2,3,5,10,20,25,30,40,50,60,70,80,90,100,120,130,150]
    }});
}

function onPrefChange() {
    mod.destroy();
    mod = create();
}

/** makes regexes multiline */
function m(reg) {
    if ( Simple.prefs.multi ) {
	return reg.replace('.*', '[^]*');
    } else {
	return reg;
    }
}
