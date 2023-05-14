### checks that versions match
#! /usr/bin/env bash
test "$(jq .version addon/manifest.json)" = "$(jq .version package.json)"
