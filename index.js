"use strict";
const Simple = require('sdk/simple-prefs');

var pm = require("sdk/page-mod").PageMod({
    include: /.*/,
    attachTo: "top",
    contentScriptFile: "./pf.js",
    contentScriptOptions: {
        limit: Simple.prefs.limit,
        regexes: [Simple.prefs.point2, Simple.prefs.point3,
                  Simple.prefs.point5, Simple.prefs.point10,
                  Simple.prefs.point20, Simple.prefs.point25,
                  Simple.prefs.point30, Simple.prefs.point40,
                  Simple.prefs.point50, Simple.prefs.point60,
                  Simple.prefs.point70, Simple.prefs.point80,
                  Simple.prefs.point90, Simple.prefs.point100,
                  Simple.prefs.point120, Simple.prefs.point130,
                  Simple.prefs.point150],
        regexValues: [2,3,5,10,20,25,30,40,50,60,70,80,90,100,120,130,150]
    }
});
