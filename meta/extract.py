"""extract single file to produce blockvals, example usage:
python ./extract.py /etc/e2guardian/lists/phraselists/pornograph/weighted"""
from __future__ import print_function
import itertools
import logging
import json

#logging.basicConfig(level=logging.DEBUG)

def from_line(line):
    '''single line to regex
    @return tuple (regex, score)'''
    (matches, score) = line.rsplit("<", 1)
    parts = [s.translate(None, "<>") for s in matches.split(">,<")]
    out = ".*" + parts.pop()
    for part in parts:
        out = "(?=.*" + part + ")"  + out
    return (out, int(score.split("#")[0].translate(None, "<>")))

def from_lines(lines):
    '''multi-line to dict
    @return {val1: regex_combination, ..., valn: regex_combination}'''
    out = {}
    for line in lines:
        logging.debug(line)
        if not line.strip() or line.startswith("#"):
            continue
        (r, s) = from_line(line)
        if s in out:
            out[s] += "|" + r
        else:
            out[s] = r
    return dict(out)


if __name__ == "__main__":
    import sys
    f = open(sys.argv[1])
    print(json.dumps(from_lines(f)))
