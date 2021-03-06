#!/usr/bin/env sh
set -ex

DESTINATION=/home/ubuntu/bin/docker-compose

wget --retry-connrefused \
     --waitretry=1 \
     --read-timeout 20 \
     --timeout 15 \
     -t 10 \
     -qO- "https://github.com/docker/compose/releases/download/1.9.0/docker-compose-`uname -s`-`uname -m`" \
     > $DESTINATION

chmod +x $DESTINATION