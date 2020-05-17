import datetime
import json
import time

OUTFILE='manifest.json'

manifest = {
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
    manifest['version'] = '{}.{}.{}'.format(current.hour, current.minute, current.second)
    print(manifest['version'])
    with open(OUTFILE, 'w') as f:
        json.dump(manifest, f, indent=2)
