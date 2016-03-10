#!/bin/sh

# Watch HTML
node_modules/.bin/jade \
	--no-debug \
	--out build/development \
	--watch \
	src/index.jade &

# Build CSS
./node_modules/.bin/stylus \
	--use nib \
	--out build/development/css/index.css \
	--watch \
	src/components/app.styl &

node_modules/.bin/watchify src/index.jsx \
  --extension=.jsx \
	--external classnames \
	--external react \
	--external react-router \
	--external react-dom \
	--outfile build/development/js/index.js \
	--standalone AnneFrank2 \
	--transform [ babelify --presets [ es2015 react stage-0 ] ] \
	--verbose
