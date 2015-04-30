/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

  'use strict';

  // detect native touch action support
  var HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
  var GESTURE_KEY = '__polymerGestures';
  var HANDLED_MARK = '__polymerGesturesHandled';

  // Disabling "mouse" handlers for 500ms is enough
  var MOUSE_TIMEOUT = 500;
  var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];

  // touch will make synthetic mouse events
  // `preventDefault` on touchend will cancel them,
  // but this breaks `<input>` focus and link clicks
  // disable mouse handlers for MOUSE_TIMEOUT ms after
  // a touchend to ignore synthetic mouse events
  var MOUSE_CANCELLER = function(mouseEvent) {
    mouseEvent[HANDLED_MARK] = true;
    // disable "ghost clicks"
    if (mouseEvent.type === 'click') {
      mouseEvent.preventDefault();
    }
  };

  function IGNORE_MOUSE(set) {
    for (var i = 0, en; i < MOUSE_EVENTS.length; i++) {
      en = MOUSE_EVENTS[i];
      if (set) {
        document.addEventListener(en, MOUSE_CANCELLER, true);
      } else {
        document.removeEventListener(en, MOUSE_CANCELLER, true);
      }
    }
    if (set) {
      // disable MOUSE_CANCELLER after MOUSE_TIMEOUT ms
      setTimeout(IGNORE_MOUSE, MOUSE_TIMEOUT);
    }
  }

  var Gestures = {
    gestures: {},
    recognizers: [],

    handleNative: function(ev) {
      if (ev[HANDLED_MARK]) {
        return;
      }
      ev[HANDLED_MARK] = true;
      var type = ev.type;
      var node = ev.currentTarget;
      var gobj = node[GESTURE_KEY];
      var gs = gobj[type];
      if (!gs) {
        return;
      }
      var recognizers = Gestures.recognizers;
      // enforce gesture recognizer order
      for (var i = 0, r; i < recognizers.length; i++) {
        r = recognizers[i];
        if (gs[r.name]) {
          r[type](ev);
        }
      }
      // ignore syntethic mouse events after a touch
      if (type === 'touchend') {
        IGNORE_MOUSE(true);
      }
    },

    // automate the event listeners for the native events
    add: function(node, evType, handler) {
      var recognizer = this.gestures[evType];
      var deps = recognizer.deps;
      var name = recognizer.name;
      var gobj = node[GESTURE_KEY];
      if (!gobj) {
        node[GESTURE_KEY] = gobj = {};
      }
      if (recognizer.touchaction) {
        this._setupTouchAction(node, recognizer.touchaction);
      }
      for (var i = 0, dep, gd; i < deps.length; i++) {
        dep = deps[i];
        gd = gobj[dep];
        if (!gd) {
          gobj[dep] = gd = {};
          node.addEventListener(dep, this.handleNative);
        }
        gd[name] = (gd[name] || 0) + 1;
      }
      node.addEventListener(evType, handler);
    },

    register: function(recog) {
      this.recognizers.push(recog);
      for (var i = 0; i < recog.exposes.length; i++) {
        this.gestures[recog.exposes[i]] = recog;
      }
    },

    // set scrolling direction on node to check later on first move
    // must call this before adding event listeners!
    setTouchAction: function(node, value) {
      if (HAS_NATIVE_TA) {
        node.style.touchAction = value;
      }
      node.touchAction = value;
    },

    _setupTouchAction: function(node, value, info) {
      // reuse custom value on node if set
      var ta = node.touchAction;
      value = ta || value;
      // set an anchor point to see how far first move is
      node.addEventListener('touchstart', function(e) {
        var t = e.changedTouches[0];
        info.initialTouch = {
          x: t.clientX,
          y: t.clientY
        };
        info.abortTrack = false;
        info.oneshot = false;
      });
      node.addEventListener('touchmove', function(e) {
        // only run this once
        if (info.oneshot) {
          return;
        }
        info.oneshot = true;
        // "none" means always track
        if (value === 'none') {
          return;
        }
        // "auto" is default, always scroll
        // bail-out if touch-action did its job
        // the touchevent is non-cancelable if the page/area is scrolling
        if (value === 'auto' || !value || (ta && !e.cancelable)) {
          info.abortTrack = true;
          return;
        }
        // check first move direction
        // unfortunately, we can only make the decision in the first move,
        // so we have to use whatever values are available.
        // Typically, this can be a really small amount, :(
        var t = e.changedTouches[0];
        var x = t.clientX,
          y = t.clientY;
        var dx = Math.abs(info.initialTouch.x - x);
        var dy = Math.abs(info.initialTouch.y - y);
        // scroll in x axis, abort track if we move more in x direction
        if (value === 'pan-x') {
          info.abortTrack = dx >= dy;
        // scroll in y axis, abort track if we move more in y direction
        } else if (value === 'pan-y') {
          info.abortTrack = dy >= dx;
        }
      });
    },

    fire: function(target, type, detail) {
      return target.dispatchEvent(
        new CustomEvent(type, {
          detail: detail,
          bubbles: true,
          cancelable: true
        })
      );
    }

  };

  Gestures.register({
    name: 'track',
    touchaction: 'none',
    deps: ['mousedown', 'touchmove', 'touchend'],

    mousedown: function(info, e) {
      var t = e.currentTarget;
      var self = this;
      var movefn = function movefn(e, up) {
        // first move is 'start', subsequent moves are 'move', mouseup is 'end'
        var state = up ? 'end' : (!info.started ? 'start' : 'move');
        info.started = true;
        self.fire(t, e, state);
        e.preventDefault();
      };
      var upfn = function upfn(e) {
        // call mousemove function with 'end' state
        movefn(e, true);
        info.started = false;
        // remove the temporary listeners
        document.removeEventListener('mousemove', movefn);
        document.removeEventListener('mouseup', upfn);
      };
      // add temporary document listeners as mouse retargets
      document.addEventListener('mousemove', movefn);
      document.addEventListener('mouseup', upfn);
    },

    touchmove: function(info, e) {
      var t = e.currentTarget;
      var ct = e.changedTouches[0];
      // if track was aborted, stop tracking
      if (info.abortTrack) {
        return;
      }
      e.preventDefault();
      // the first track event is sent after some hysteresis with touchmove.
      // Use `started` state variable to differentiate the "first" move from
      // the rest to make track.state == 'start'
      // first move is 'start', subsequent moves are 'move'
      var state = !info.started ? 'start' : 'move';
      info.started = true;
      this.fire(t, ct, state);
    },

    touchend: function(info, e) {
      var t = e.currentTarget;
      var ct = e.changedTouches[0];
      // only trackend if track was started and not aborted
      if (info.started && !info.abortTrack) {
        // reset started state on up
        info.started = false;
        this.fire(t, ct, 'end');
        // iff tracking, always prevent tap
        e.tapPrevented = true;
      }
    },

    fire: function(target, touch, state) {
      return Gestures.fire(target, 'track', {
        state: state,
        x: touch.clientX,
        y: touch.clientY
      });
    }

  });

  // dispatch a *bubbling* "tap" only at the node that is the target of the
  // generating event.
  // dispatch *synchronously* so that we can implement prevention of native
  // actions like links being followed.
  //
  // TODO(dfreedm): a tap should not occur when there's too much movement.
  // Right now, a tap can occur when a touchend happens very far from the
  // generating touch.
  // This *should* obviate the need for tapPrevented via track.
  Gestures.register({
    name: 'tap',
    deps: ['click', 'touchend'],

    click: function(info, e) {
      this.forward(e);
    },

    touchend: function(info, e) {
      this.forward(e);
    },

    forward: function(e) {
      // prevent taps from being generated from events that have been
      // canceled or already handled via a listener lower in the tree.
      if (!e.tapPrevented) {
        e.tapPrevented = true;
        this.fire(e.target);
      }
    },

    // fire a bubbling event from the generating target.
    fire: function(target) {
      Gestures.fire(target, 'tap', {}, true);
    }

  });

  // expose Polymer.Gestures as the behavior for gestures
  scope.Gestures = {
    // override _addListener to handle gestures
    _addListener: function(node, eventName, handler) {
      if (Gestures.gestures[eventName]) {
        Gestures.add(node, eventName, handler);
      } else {
        node.addEventListener(eventName, handler);
      }
    }
  };

})(Polymer);
