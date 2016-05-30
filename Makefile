all: xpi

clean:
	rm *xpi 2>/dev/null || true

lint: clean
	jshint index.js data/pf.js

xpi: lint
	jpm xpi
