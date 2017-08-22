import './sub/style-import.js';
const $_documentContainer = document.createElement('div');
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

document.head.appendChild($_documentContainer);
