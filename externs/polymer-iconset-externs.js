/**
 * @externs
 * @fileoverview Externs for Polymer.Iconset.
 */

/**
 * The interface that iconsets should obey. Iconsets are registered by setting
 * their name in the IronMeta 'iconset' db, and a value of type Polymer.Iconset.
 *
 * Used by iron-icon but needs to live here since iron-icon, iron-iconset, etc don't
 * depend on each other at all and talk only through iron-meta.
 *
 * @interface
 */
Polymer.Iconset = function() {};

/**
 * Applies an icon to the given element as a css background image. This
 * method does not size the element, and it's usually necessary to set
 * the element's height and width so that the background image is visible.
 *
 * @param {Element} element The element to which the icon is applied.
 * @param {string} icon The name of the icon to apply.
 * @param {string=} theme (optional) The name or index of the icon to apply.
 * @param {number=} scale (optional, defaults to 1) Icon scaling factor.
 */
Polymer.Iconset.prototype.applyIcon = function(
      element, icon, theme, scale) {};

/**
 * Remove an icon from the given element by undoing the changes effected
 * by `applyIcon`.
 *
 * @param {Element} element The element from which the icon is removed.
 */
Polymer.Iconset.prototype.removeIcon = function(element) {};
