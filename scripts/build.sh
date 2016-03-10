#!/bin/sh

# Create dirs
rm -rf build/development
mkdir -p build/development/js
mkdir -p build/development/css

cp -r static/* build/development/

# Build HTML
scripts/html.sh

# Build CSS
./node_modules/.bin/stylus \
	--use nib \
	--compress \
	--out build/development/css/index.css \
	src/components/app.styl

# Bundle JS libs
node_modules/.bin/browserify \
	--require classnames \
	--require react-router \
	--require react-dom \
	--require react > build/development/js/libs.js

# Build JS
node_modules/.bin/browserify src/index.jsx \
  --extension=.jsx \
	--external classnames \
	--external react-router \
	--external react \
	--external react-dom \
	--standalone Tekstregeldetectie \
	--transform [ babelify --presets [ es2015 react stage-0 ] ] \
	--verbose > build/development/js/index.js
