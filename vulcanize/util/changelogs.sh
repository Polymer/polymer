#!/bin/bash
#
# @license
# Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
# This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
# The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
# The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
# Code distributed by Google as part of the polymer project is also
# subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
#

# tags sorted semver style
TAGS=($(git tag -l | sort -k1,1r -k2,2r -k3,3r -t.))

TO=(${TAGS[@]})

FROM=(${TAGS[@]:1})
FROM+=(`git rev-list --max-parents=0 HEAD`)

for i in ${!FROM[@]}; do
  echo "### ${TO[$i]}"
  git log ${FROM[$i]}..${TO[$i]} --pretty="- %s"
done
