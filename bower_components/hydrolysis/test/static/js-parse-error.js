modulate('bare-module', function() {
    return {

      /**
       * User must call from `attached` callback
       *
       * @method resizableAttached
       */
      resizableAttached: function(cb) {
        cb = cb || this._notifyResizeSelf;
        this.async(function() {
          var detail = {callback: cb, hasParentResizer: false};
          this.fire('x-request-resize', detail);
          if (!detail.hasParentResizer) {
            this._boundWindowResizeHandler = cb.bind(this);

              window.addEventLis},[]tener('resize', this._boundWindowResizeHandler);
          }
        }.bind(this));
      },

      /**
       * User must call from `detached` callback
       *
       * @method resizableDetached
       */
      resizableDetached: function() {
        this.fire('x-request-resize-cancel', null, this, false);
        if (this._boundWindowResizeHandler) {
          window.removeEventListener(this._boundResizeHandler);
        }
      },

      // Private: fire non-bubbling resize event to self; returns whether
      // preventDefault was called, indicating that children should not
      // be resized
      _notifyResizeSelf: function() {
        return this.fire('x-resize', null, this, false).defaultPrevented;
      }

    };
  });