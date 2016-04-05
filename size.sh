echo 'all-lib ' && polybuild --maximum-crush all-lib.html && gzip -c all-lib.build.js | wc -c && rm all-lib.build.*

echo 'polymer ' && polybuild --maximum-crush polymer.html && gzip -c polymer.build.js | wc -c && rm polymer.build.*