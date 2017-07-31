zip: lint
	cd addon; zip ../jsguardian.zip *

lint:
	jshint addon/*.js
	! grep browser addon/*.js
	python -m json.tool addon/manifest.json > /dev/null
	python -m json.tool addon/preset.json > /dev/null
	python -m json.tool addon/schema.json > /dev/null
	html-validator --file=addon/options.html # uses the npm package
	html-validator --file=addon/blockpage.html

