/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  var coreDateParse = Date.parse;

  function createDate(year, month, day, hour, minute, second, millisecond) {
    // hour through ms are optional and undefined if not provided. Passing 
    // undefined into the Date constructor results in an invalid date. 
    // Null, on the other hand, is valid.
    return new Date(year, month-1, day,
      hour ? hour : null, minute ? minute : null,
      second ? second : null, millisecond ? millisecond : null);
  }

  Date.parse = function(dateString) {
    // Support - and . formatted date strings
    if ((/(-|\.)/g).test(dateString)) {
      var dateParts = dateString.match(/(\d+)/g);

      return coreDateParse(createDate.apply(null, dateParts));
    }
    
    // Otherwise, call Date.parse
    return coreDateParse(dateString);
  };
})();	