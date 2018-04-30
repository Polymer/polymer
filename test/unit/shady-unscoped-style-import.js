/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="global-shared1">
  <template>
    <style shady-unscoped="">
      :root {
        --zug: margin: 10px;
      }

      .happy {
        @apply --zug;
        border: 1px solid green;
      }
    </style>

    <style>
      .normal {
        border: 3px solid orange;
      }
    </style>
  </template>
</dom-module><dom-module id="global-shared2">
</dom-module>`;

document.head.appendChild($_documentContainer.content);
