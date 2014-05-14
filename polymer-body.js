// upgrade polymer-body last so that it can contain other imported elements
document.addEventListener('polymer-ready', function() {

  Polymer('polymer-body', Platform.mixin({

    created: function() {
      this.template = document.createElement('template');
      var body = wrap(document).body;
      var c$ = body.childNodes.array();
      for (var i=0, c; (c=c$[i]); i++) {
        if (c.localName !== 'script') {
          this.template.content.appendChild(c);
        }
      }
      // snarf up user defined model
      window.model = this;
    },

    parseDeclaration: function(elementElement) {
      this.lightFromTemplate(this.template);
    }

  }, window.model));

});