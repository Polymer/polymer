echo 'all-lib ' && polybuild all-lib.html && gzip -c all-lib.build.js | wc -c && rm all-lib.build.*

echo 'polymer ' && polybuild polymer.html && gzip -c polymer.build.js | wc -c && rm polymer.build.*