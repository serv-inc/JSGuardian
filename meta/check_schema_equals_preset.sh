### checks that these have the same keys
#! /usr/bin/env bash
[ "$(jq 'keys' addon/preset.json)" = "$(jq '.properties | keys' addon/schema.json)" ] 
