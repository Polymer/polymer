# hydrolysis

Static anlaysis utilities for polymer.

## Install
```
npm install hydrolysis
```

## Usage
```js
var hyd = require('hydrolysis');

hyd.Analyzer.analyze('path-to-polymer-element.html')
    .then(function(analyzer) {
      console.log(analyzer.elementsByTagName['my-element'])
    });
```

For more detail, see the [API Docs](API.md).


## Developing
You need [wct](https://github.com/Polymer/web-component-tester) to run the tests.

Run a one-off build of the project:

```sh
npm run build
```

Or watch the source for changes, and rebuild each time a file is modified:

```sh
npm run watch
```
