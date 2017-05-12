#!/bin/bash

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
