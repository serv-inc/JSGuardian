LINTER=./node_modules/.bin/eslint


zip: lint
	cd addon; zip ../jsguardian.zip *

lint:
	${LINTER} addon/*.js
	! grep browser addon/*.js
	python2 -m json.tool addon/manifest.json > /dev/null
	python2 -m json.tool addon/preset.json > /dev/null
	python2 -m json.tool addon/schema.json > /dev/null
	tidy -eq addon/options.html
	tidy -eq addon/blockpage.html
	./meta/check_schema_equals_preset.sh
	./meta/same_version.py


cp: zip
	cp jsguardian.zip /tmp
	cd /tmp && unzip -o jsguardian.zip
