const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="style-import">
  <template>
    <style>
      .foo {
        height: 2px;
        border: 1px solid orange;
        background: url(google.png);
      }
    </style>
  </template>
</dom-module><dom-module id="style-import2">
  <template>
    <style>
      .foo {
        width: 4px;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
