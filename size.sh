echo 'property-effects ' && polybuild --maximum-crush src/properties/property-effects.html && gzip -c src/properties/property-effects.build.js | wc -c && rm src/properties/property-effects.build.*

echo 'gesture-event-listeners ' && polybuild --maximum-crush src/events/gesture-event-listeners.html && gzip -c src/events/gesture-event-listeners.build.js | wc -c && rm src/events/gesture-event-listeners.build.*

echo 'all-lib ' && polybuild --maximum-crush all-lib.html && gzip -c all-lib.build.js | wc -c && rm all-lib.build.*

echo 'polymer ' && polybuild --maximum-crush polymer.html && gzip -c polymer.build.js | wc -c && rm polymer.build.*