/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {
  
  var ContextFreeParser = {
    parse: function(text) {
      var top = {};
      var entities = [];
      var current = top;
      var subCurrent = {};
  
      var scriptDocCommentClause = '\\/\\*\\*([\\s\\S]*?)\\*\\/';
      var htmlDocCommentClause = '<!--([\\s\\S]*?)-->';
  
      // matches text between /** and */ inclusive and <!-- and --> inclusive
      var docCommentRegex = new RegExp(scriptDocCommentClause + '|' + htmlDocCommentClause, 'g');
  
      // acquire all script doc comments
      var docComments = text.match(docCommentRegex) || [];
  
      // each match represents a single block of doc comments
      docComments.forEach(function(m) {
        // unify line ends, remove all comment characters, split into individual lines
        var lines = m.replace(/\r\n/g, '\n').replace(/^\s*\/\*\*|^\s*\*\/|^\s*\* ?|^\s*\<\!-\-|^s*\-\-\>/gm, '').split('\n');
  
        // pragmas (@-rules) must occur on a line by themselves
        var pragmas = [];
        // filter lines whose first non-whitespace character is @ into the pragma list
        // (and out of the `lines` array)
        lines = lines.filter(function(l) {
          var m = l.match(/\s*@([\w-]*) (.*)/);
          if (!m) {
            return true;
          }
          pragmas.push(m);
        });
  
        // collect all other text into a single block
        var code = lines.join('\n');
        
        // process pragmas
        pragmas.forEach(function(m) {
          var pragma = m[1], content = m[2];
          switch (pragma) {
  
            // currently all entities are either @class or @element
            case 'class':
            case 'element':
              current = {
                name: content,
                description: code
              };
              entities.push(current);
              break;
            
            // an entity may have these describable sub-features
            case 'attribute':
            case 'property':
            case 'method':
            case 'event':
              subCurrent = {
                name: content,
                description: code
              };
              var label = pragma == 'property' ? 'properties' : pragma + 's';
              makePragma(current, label, subCurrent);
              break;
  
            // sub-feature pragmas
            case 'default':
            case 'type':
              subCurrent[pragma] = content;
              break;

            case 'param':
              var eventParmsRe = /\{(.+)\}\s+(\w+[.\w+]+)\s+(.*)$/;

              var params = content.match(eventParmsRe);
              if (params) {
                var subEventObj = {
                  type: params[1],
                  name: params[2],
                  description: params[3]
                };
                makePragma(subCurrent, pragma + 's', subEventObj);
              }

              break;
  
            // everything else
            default:
              current[pragma] = content;
              break;
          }
        });
  
        // utility function, yay hoisting
        function makePragma(object, pragma, content) {
          var p$ = object;
          var p = p$[pragma];
          if (!p) {
            p$[pragma] = p = [];
          }
          p.push(content);
        }
  
      });
  
      if (entities.length === 0) {
        entities.push({name: 'Entity', description: '**Undocumented**'});
      }
      return entities;
    }
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextFreeParser;
  } else {
    scope.ContextFreeParser = ContextFreeParser;
  }
  
})(this);