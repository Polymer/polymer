Prism.languages.ini= {
	'comment': /^\s*;.*$/m,
	'important': /\[.*?\]/m,
	'constant': /^\s*[^\s=]+?(?=[ \t]*=)/m,
	'attr-value': {
		pattern: /=.*/m,
		inside: {
			'punctuation': /^[=]/
		}
	}
};