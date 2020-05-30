.PHONY: test zip lint cp push setup
LINTER=npx eslint


zip: lint test
	cd addon; zip ../jsguardian.zip *

lint:
	${LINTER} addon/*.js
	! grep browser addon/*.js
	# grep '"use strict";' addon/*.js > /dev/null checked by jshint
	python2 -m json.tool addon/manifest.json > /dev/null
	python2 -m json.tool addon/preset.json > /dev/null
	python2 -m json.tool addon/schema.json > /dev/null
	tidy -eq addon/options.html
	tidy -eq addon/blockpage.html
	./meta/check_schema_equals_preset.sh

test: setup
	npm test

setup:
	npm install

cp: zip
	cp jsguardian.zip /tmp
	cd /tmp && unzip -o jsguardian.zip

push:
	git pull && git push


dev:
	(cd test/html && python3 -m http.server &)
	cd trycontentscriptworker/ && ./manifest.py

devstop:
	killall python3
