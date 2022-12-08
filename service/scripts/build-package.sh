#!/bin/bash

# launch a clean build, check the tests
PACKAGE=${1:='holidays'}
pushd ../packages/${PACKAGE}
npm run clean
npm install
npm run test
popd
