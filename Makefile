USER=$(shell cat local/moz_uid)
PASS=$(shell cat local/moz_pass)

all: sign

sign: lint clean
	jpm -v sign --api-key $(USER) --api-secret $(PASS)

clean:
	rm *xpi 2>/dev/null || true

lint: clean
	jshint index.js data/pf.js

xpi: lint
	jpm xpi
