"use strict";

// currently no multi-line match
const LIMIT = self.options.limit;
const REGEX_VALUES = self.options.regexValues;
const REGEXES = self.options.regexes;

const SITE_TEXT = document.body.innerText || document.body.textContent;
//console.log(document.location.href + " has content: " + SITE_TEXT); // debug

let i = 0;
let score = 0;
let all_matches = [];

function scan() {
    const REGEX = RegExp(REGEXES[i], 'g');
    let matches = new Set(SITE_TEXT.match(REGEX));
    score += matches.size * REGEX_VALUES[i];
    matches.forEach((el) => all_matches.push(el));
//    console.log('matches: ' + JSON.stringify(matches))
//    console.log('score after ' + REGEX_VALUES[i] + ": " + score);
    if ( score > LIMIT ) {
        document.body.textContent = createText();
    }
    i += 1;
    if ( i < REGEXES.length ) {
        setTimeout(scan, 0);
    }
}

function createText() {
    let out = 'page was blocked (score=' + score + ') due to: \n';
    all_matches.forEach((el) => out += el.substr(0,300) + ', ');
    return out;
}

scan();
