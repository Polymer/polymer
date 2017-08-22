const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <style>
    :host {
      border: 4px solid tomato;
    }
  </style>
  
  
  <template>
    <style>
      #three {
        border: 3px solid tomato;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
