paper-toolbar
============

`paper-toolbar` is a horizontal bar containing items that can be used for
label, navigation, search and actions.  The items place inside the
`paper-toolbar` are projected into a `class="horizontal center layout"` container inside of
`paper-toolbar`'s Shadow DOM.  You can use flex attributes to control the items'
sizing.

Example:

```html
<paper-toolbar>
  <paper-icon-button icon="menu" on-tap="{{menuAction}}"></paper-icon-button>
  <div title>Title</div>
  <paper-icon-button icon="more" on-tap="{{moreAction}}"></paper-icon-button>
</paper-toolbar>
```

`paper-toolbar` has a standard height, but can made be taller by setting `tall`
class on the `paper-toolbar`.  This will make the toolbar 3x the normal height.

```html
<paper-toolbar class="tall">
  <paper-icon-button icon="menu"></paper-icon-button>
</paper-toolbar>
```

Apply `medium-tall` class to make the toolbar medium tall.  This will make the
toolbar 2x the normal height.

```html
<paper-toolbar class="medium-tall">
  <paper-icon-button icon="menu"></paper-icon-button>
</paper-toolbar>
```

When `tall`, items can pin to either the top (default), middle or bottom.  Use
`middle` class for middle content and `bottom` class for bottom content.

```html
<paper-toolbar class="tall">
  <paper-icon-button icon="menu"></paper-icon-button>
  <div title class="middle">Middle Title</div>
  <div title class="bottom">Bottom Title</div>
</paper-toolbar>
```

For `medium-tall` toolbar, the middle and bottom contents overlap and are
pinned to the bottom.  But `middleJustify` and `bottomJustify` attributes are
still honored separately.
