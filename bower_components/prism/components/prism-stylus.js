Prism.languages.stylus = {
	'comment': {
		pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,
		lookbehind: true
	},
	'keyword': /(px|r?em|ex|ch|vw|vh|vmin|vmax|deg|grad|rad|turn|m?s|k?Hz|dpi|dppx|dpcm)\b|\b(is|defined|not|isnt|and|or|unless|for|in)\b/g,
	'atrule': /@[\w-]+(?=\s+\S+)/gi,
	'url': /url\((["']?).*?\1\)/gi,
	'variable': /^\s*([\w-]+)(?=\s*[+-\\]?=)/gm,
	'string': /("|')(\\\n|\\?.)*?\1/g,
	'important': /\B!important\b/gi,
	'hexcode': /#[\da-f]{3,6}/gi,
	'entity': /\\[\da-f]{1,8}/gi,
	'number': /\d+\.?\d*%?/g,
	'selector': [
		{
			pattern: /::?(after|before|first-letter|first-line|selection)/g,
			alias: 'pseudo-element'
		},{
			pattern: /:(?:active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|in-range|invalid|lang|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-of-type|only-child|optional|out-of-range|read-only|read-write|required|root|target|valid|visited)(?:\(.*\))?/g,
			alias:'pseudo-class'
		},{
			pattern: /\[[\w-]+?\s*[*~$^|=]?(?:=\s*\S+)?\]/g,
			inside: {
				"attr-name":
				{
					pattern: /(\[)([\w-]+)(?=\s*[*~$^|=]{0,2})/g,
					lookbehind: true
				},
				"punctuation": /\[|\]/g,
				"operator": /[*~$^|=]/g,
				"attr-value": {
					pattern: /\S+/
				},
			},
			alias: 'attr'
		},
		{
			pattern: /\.[a-z-]+/i,
			alias: 'class'
		},
		{
			pattern: /#[a-z-]+/i,
			alias: 'id'
		},
		{
			pattern: /\b(html|head|title|base|link|meta|style|script|noscript|template|body|section|nav|article|aside|h[1-6]|header|footer|address|main|p|hr|pre|blockquote|ol|ul|li|dl|dt|dd|figure|figcaption|div|a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|dbo|span|br|wbr|ins|del|image|iframe|embed|object|param|video|audio|source|track|canvas|map|area|sv|math|table|caption|colgroup|col|tbody|thead|tfoot|tr|td|th|form|fieldset|legeng|label|input|button|select|datalist|optgroup|option|textarea|keygen|output|progress|meter|details|summary|menuitem|menu)\b/g,
			alias: 'tag'
		},
	],
	'property': [
		/^\s*([a-z-]+)(?=\s+[\w\W]+|\s*:)(?!\s*\{|\r?\n)/mig,
		{
			pattern: /(\(\s*)([a-z-]+)(?=\s*:)/ig,
			lookbehind: true
		}
	],
	'function': /[-a-z0-9]+(?=\()/ig,
	'punctuation': /[\{\};:]/g,
	'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/g
}
