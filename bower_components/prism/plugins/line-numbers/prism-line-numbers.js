Prism.hooks.add('after-highlight', function (env) {
	// works only for <code> wrapped inside <pre data-line-numbers> (not inline)
	var pre = env.element.parentNode;
	if (!pre || !/pre/i.test(pre.nodeName) || pre.className.indexOf('line-numbers') === -1) {
		return;
	}

	var linesNum = (1 + env.code.split('\n').length);
	var lineNumbersWrapper;

	lines = new Array(linesNum);
	lines = lines.join('<span></span>');

	lineNumbersWrapper = document.createElement('span');
	lineNumbersWrapper.className = 'line-numbers-rows';
	lineNumbersWrapper.innerHTML = lines;

	if (pre.hasAttribute('data-start')) {
		pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
	}

	env.element.appendChild(lineNumbersWrapper);

});