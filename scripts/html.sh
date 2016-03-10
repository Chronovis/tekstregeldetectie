
#!/bin/sh

# Build HTML
node_modules/.bin/jade \
	--no-debug \
	--out build/development \
	src/index.jade
