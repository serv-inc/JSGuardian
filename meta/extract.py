#! /usr/bin/env python3
"""extract single file to produce blockvals, example usage:
python ./extract.py /etc/e2guardian/lists/phraselists/pornograph/weighted"""
from __future__ import print_function
import itertools
import logging
import json

#logging.basicConfig(level=logging.DEBUG)
REMOVEBRACKETS=str.maketrans('', '', '<>')

def from_line(line):
    '''single line to regex
    @return tuple (regex, score)'''
    (matches, score) = line.rsplit("<", 1)
    parts = [s.translate(REMOVEBRACKETS) for s in matches.split(">,<")]
    out = ".*" + parts.pop()
    for part in parts:
        out = "(?=.*" + part + ")"  + out
    return (out, int(score.split("#")[0].translate(REMOVEBRACKETS)))

def from_lines(lines):
    '''multi-line to dict
    @return {val1: regex_combination, ..., valn: regex_combination}'''
    out = {}
    for line in lines:
        logging.debug(line)
        if not line.strip() or line.startswith("#"):
            continue
        try:
            (r, s) = from_line(line)
        except ValueError:
            logging.error("error trying to decode %s", line)
            continue
        if s in out:
            out[s] += "|" + r
        else:
            out[s] = r
    return dict(out)


if __name__ == "__main__":
    import sys
    f = open(sys.argv[1])
    try:
        print(json.dumps(from_lines(f)))
    except UnicodeDecodeError:
        logging.error("trying %s in latin-1", sys.argv[1])
        f = open(sys.argv[1], encoding='latin-1')
        print(json.dumps(from_lines(f)))
# weighted jap has other enc, see file and also encodings.aliases.aliases
