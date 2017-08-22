import { Polymer } from '../../lib/legacy/polymer-fn.js';
Polymer({
  is: 'observe-el',
  observers: [
    'singleChanged(singleSelected.*)',
    'multiChanged(multiSelected.*)'
  ],
  singleChanged: function() {},
  multiChanged: function() {}
});
