"use strict";
const Simple = require('sdk/simple-prefs');

Simple.on("limit", onPrefChange);
Simple.on("multi", onPrefChange);
Simple.on("whitelist", onPrefChange);

let mod = create();

function create(limit) {
    return require("sdk/page-mod").PageMod({
        include: /.*/,
        exclude: RegExp(Simple.prefs.whitelist),
        attachTo: "top",
        contentScriptFile: "./pf.js",
        contentScriptOptions: {
            limit: Simple.prefs.limit,
            regexes: [ml(Simple.prefs.point2), ml(Simple.prefs.point3),
                      ml(Simple.prefs.point5), ml(Simple.prefs.point10),
                      ml(Simple.prefs.point20), ml(Simple.prefs.point25),
                      ml(Simple.prefs.point30), ml(Simple.prefs.point40),
                      ml(Simple.prefs.point50), ml(Simple.prefs.point60),
                      ml(Simple.prefs.point70), ml(Simple.prefs.point80),
                      ml(Simple.prefs.point90), ml(Simple.prefs.point100),
                      ml(Simple.prefs.point120), ml(Simple.prefs.point130),
                      ml(Simple.prefs.point150)],
            regexValues: [2,3,5,10,20,25,30,40,50,60,70,80,90,100,120,130,150]
        }});
}

function onPrefChange() {
    mod.destroy();
    mod = create();
}

/** makes regexes multiline */
function ml(reg) {
    if ( Simple.prefs.multi ) {
	return reg.replace('.*', '[^]*');
    } else {
	return reg;
    }
}
