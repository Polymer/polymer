import { pathFromUrl } from '../../../lib/utils/resolve-url.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');
const baseAssetPath = pathFromUrl(import.meta.url);
$_documentContainer.innerHTML = `<dom-module id="style-import" assetpath="${baseAssetPath}">
  <template>
    <style>
      .foo {
        height: 2px;
        border: 1px solid orange;
        background: url(google.png);
      }
    </style>
  </template>
</dom-module><dom-module id="style-import2" assetpath="${baseAssetPath}">
  <template>
    <style>
      .foo {
        width: 4px;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
