JSHINT=./node_modules/jshint/bin/jshint


zip: lint
	cd addon; zip ../jsguardian.zip *

lint:
	${JSHINT} addon/*.js
	! grep browser addon/*.js
	# grep '"use strict";' addon/*.js > /dev/null checked by jshint
	python2 -m json.tool addon/manifest.json > /dev/null
	python2 -m json.tool addon/preset.json > /dev/null
	python2 -m json.tool addon/schema.json > /dev/null
	# tidy unavailable on OpenBSD
	tidy -eq addon/options.html
	tidy -eq addon/blockpage.html
	./check_schema_equals_preset.sh

