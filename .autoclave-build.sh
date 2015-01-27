#!/bin/bash
#
# @license
# Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
# This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
# The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
# The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
# Code distributed by Google as part of the polymer project is also
# subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
npm install

grunt release

lasttag=`git tag -l | sort -t. -k1,1n -k2,2n -k3,3n | tail -n 1`
git checkout --detach ${lasttag}
git merge -s ours master --no-commit

mv dist/* .

git show master:dist/polymer.html > polymer.html

git add --ignore-errors polymer.js polymer.min.js polymer.html layout.html bower.json README.md build.log
