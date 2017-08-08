zip: lint
	cd addon; zip ../jsguardian.zip *

lint:
	jshint addon/*.js
	! grep browser addon/*.js
	# grep '"use strict";' addon/*.js > /dev/null checked by jshint
	python -m json.tool addon/manifest.json > /dev/null
	python -m json.tool addon/preset.json > /dev/null
	python -m json.tool addon/schema.json > /dev/null
	tidy -eq addon/options.html
	tidy -eq addon/blockpage.html

