#!/bin/bash
#
# @license
# Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
# This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
# The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
# The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
# Code distributed by Google as part of the polymer project is also
# subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
#

PRETTY="- %s ([commit](https://github.com/Polymer/polymer/commit/%h))%n"
start="$1"
end="$2"

enddate=`git log -1 ${end} --pretty="%ai" | cut -d ' ' -f 1`

old=""
if [ -e CHANGELOG.md ]; then
  old="`sed -e '1,2d' CHANGELOG.md`"
fi

cat > CHANGELOG.md <<EOD
# Change Log

## [${end}](https://github.com/Polymer/polymer/tree/${end}) (${enddate})
`git log --no-merges "${start}".."${end}^1" --pretty="${PRETTY}"`

${old}
EOD
