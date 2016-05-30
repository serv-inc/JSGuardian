all: xpi

lint:
	jshint index.js data/pf.js

xpi: lint
	jpm xpi
