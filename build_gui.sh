#!/bin/bash

cd gui && REACT_APP_PUBLIC_URL=/highkick/gui yarn run build && cd ..
rm -rf server/static/* && cp -R gui/build/ server/static/
sed -i -e 's/src=\"\/static/src=\"\/highkick\/gui\/static/g' server/static/index.html
