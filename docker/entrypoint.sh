#!/bin/bash

# NPM link hilib
cd ./annefrank2-statics
echo "developer" | sudo -S npm link

cd ../hire-djatoka-client
echo "developer" | sudo -S npm link

ssh-add ~/.ssh/id_rsa

# Start tmuxinator
mux annefrank
