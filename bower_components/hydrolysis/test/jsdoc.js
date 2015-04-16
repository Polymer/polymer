var jsdoc = require('hydrolysis').jsdoc;

describe('jsdoc', function() {

  describe('.parseJsdoc', function() {

    it('parses single-line', function() {
      var parsed = jsdoc.parseJsdoc('* Just some text');
      expect(parsed).to.deep.eq({
        body: 'Just some text',
        tags: [],
      });
    });

    it('parses body-only', function() {
      var parsed = jsdoc.parseJsdoc('* Just some text\n* in multiple lines.');
      expect(parsed).to.deep.eq({
        body: 'Just some text\nin multiple lines.',
        tags: [],
      });
    });

    it('parses tag-only', function() {
      var parsed = jsdoc.parseJsdoc('* @atag');
      expect(parsed).to.deep.eq({
        body: null,
        tags: [
          {tag: 'atag', type: null, name: null, body: null},
        ],
      });
    });

    it('parses tag-name', function() {
      var parsed = jsdoc.parseJsdoc('* @do stuff');
      expect(parsed).to.deep.eq({
        body: null,
        tags: [
          {tag: 'do', type: null, name: 'stuff', body: null},
        ],
      });
    });

    it('parses tag-name-type', function() {
      var parsed = jsdoc.parseJsdoc('* @do a thing');
      expect(parsed).to.deep.eq({
        body: null,
        tags: [
          {tag: 'do', type: null, name: 'a', body: 'thing'},
        ],
      });
    });

    it('parses tag-type', function() {
      var parsed = jsdoc.parseJsdoc('* @do {Type}');
      expect(parsed).to.deep.eq({
        body: null,
        tags: [
          {tag: 'do', type: 'Type', name: null, body: null},
        ],
      });
    });

    it('parses desc+tag', function() {
      var parsed = jsdoc.parseJsdoc('* The desc.\n* @do {a} thing');
      expect(parsed).to.deep.eq({
        body: 'The desc.',
        tags: [
          {tag: 'do', type: 'a', name: 'thing', body: null},
        ],
      });
    });

    it('parses desc+tags', function() {
      var parsed = jsdoc.parseJsdoc('* The desc.\n* @do {a} thing\n* @another thing');
      expect(parsed).to.deep.eq({
        body: 'The desc.',
        tags: [
          {tag: 'do',      type: 'a',  name: 'thing', body: null},
          {tag: 'another', type: null, name: 'thing', body: null},
        ],
      });
    });

    it('parses multiline tags', function() {
      var parsed = jsdoc.parseJsdoc('* @do {a} thing\n* with\r\n* stuff\n* @another thing');
      expect(parsed).to.deep.eq({
        body: null,
        tags: [
          {tag: 'do',      type: 'a',  name: 'thing', body: 'with\n stuff'},
          {tag: 'another', type: null, name: 'thing', body: null},
        ],
      });
    });

    it('allows for wrapped tags', function() {
      var parsed = jsdoc.parseJsdoc('* @do\n* {a}\n* thing\n* with\n* stuff');
      expect(parsed).to.deep.eq({
        body: null,
        tags: [
          {tag: 'do', type: 'a', name: 'thing', body: 'with\n stuff'},
        ],
      });
    });

    it('expands chained tags', function() {
      var parsed = jsdoc.parseJsdoc('* @private @type {Foo}');
      expect(parsed).to.deep.eq({
        body: null,
        tags: [
          {tag: 'private', type: 'Foo', name: null, body: null},
          {tag: 'type',    type: 'Foo', name: null, body: null},
        ],
      });
    });

    it('preserves indentation for the body', function() {
      var parsed = jsdoc.parseJsdoc('*   The desc.\n* thing');
      expect(parsed.body).to.deep.eq('  The desc.\nthing');
    });

    it('handles empty lines', function() {
      var parsed = jsdoc.parseJsdoc('*\n *\n * Foo\n   *\n * Bar');
      expect(parsed.body).to.eq('Foo\n\nBar');
    });

  });

});
