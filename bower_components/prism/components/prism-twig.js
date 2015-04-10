Prism.languages.twig = {
	'comment': /\{#[\s\S]*?#\}/,
	'tag': {
		pattern: /(\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\})/,
		inside: {
			'ld': {
				pattern: /^(\{\{\-?|\{%\-?\s*\w+)/,
				inside: {
					'punctuation': /^(\{\{|\{%)\-?/,
					'keyword': /\w+/
				}
			},
			'rd': {
				pattern: /\-?(%\}|\}\})$/,
				inside: {
					'punctuation': /.*/
				}
			},
			'string': {
				pattern: /("|')(\\?.)*?\1/,
				inside: {
					'punctuation': /^('|")|('|")$/
				}
			},
			'keyword': /\b(if)\b/,
			'boolean': /\b(true|false|null)\b/,
			'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/,
			'operator': /==|=|!=|<|>|>=|<=|\+|\-|~|\*|\/|\/\/|%|\*\*|\|/,
			'space-operator': {
				pattern: /(\s)(\b(not|b\-and|b\-xor|b\-or|and|or|in|matches|starts with|ends with|is)\b|\?|:|\?:)(?=\s)/,
				lookbehind: true,
				inside: {
					'operator': /.*/
				}
			},
			'property': /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
			'punctuation': /\(|\)|\[\]|\[|\]|\{|\}|:|\.|,/
		}
	},

	// The rest can be parsed as HTML
	'other': {
		pattern: /[\s\S]*/,
		inside: Prism.languages.markup
	}
};
