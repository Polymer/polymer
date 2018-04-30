/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import './sub/style-import.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="shared-style">
  <template>
    <style>
      html {
        --import-var: 3px solid orange;
      }
    </style>
  </template>
</dom-module><dom-module id="shared-style2">
  <template>
    <style>
      .zazz {
        border: 16px solid orange;
      }
    </style>
  </template>
</dom-module><custom-style>
<style is="custom-style" include="shared-style style-import
  style-import2">
  html {

    --import-mixin: {
      border: 4px solid blue;
    };

    padding: 10px;
  }
</style>
</custom-style>`;

document.head.appendChild($_documentContainer.content);
