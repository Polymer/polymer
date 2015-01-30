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

pushd ..
git clone git://github.com/Polymer/NodeBind
git clone git://github.com/Polymer/TemplateBinding
git clone git://github.com/Polymer/URL
git clone git://github.com/Polymer/observe-js
git clone git://github.com/Polymer/polymer-expressions
git clone git://github.com/Polymer/polymer-gestures
git clone git://github.com/Polymer/tools
popd

grunt release

lasttag=`git tag -l | sort -t. -k1,1n -k2,2n -k3,3n | tail -n 1`
git checkout --detach ${lasttag}
git merge -s ours master --no-commit

files=(`ls dist | sed -e 's/\/dist//' | grep -v 'polymer-versioned.js'`)
mv dist/* .

git add -f --ignore-errors "${files[@]}"
