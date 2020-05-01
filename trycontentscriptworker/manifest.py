import json
import time
import datetime

OUTFILE='manifest.json'

a = {
  "manifest_version": 2,

  "name": "test web worker content script",
  "version": "0.1",
  "author": "serv-inc",

  "permissions": ["tabs", "<all_urls>"],

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["./load_worker.js"],
      "all_frames": True
    }
  ]
}

while True:
    time.sleep(1)
    current = datetime.datetime.now()
    a['version'] = '{}.{}.{}'.format(current.hour, current.minute, current.second)
    print(a['version'])
    with open(OUTFILE) as f:
        json.dump(a, open(OUTFILE, 'w'), indent=2)
