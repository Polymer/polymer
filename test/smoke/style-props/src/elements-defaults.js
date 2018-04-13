const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<style is="custom-style">
  html {
    --x-s: {
      display: inline-block;
      margin: 16px;
      border-radius: 4px;
      padding: 2px;
    };
  }
</style>`;

document.head.appendChild($_documentContainer);
