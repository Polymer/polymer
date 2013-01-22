# Toolkitchen:Toolkit

## Extremely Brief Overview

Source files for Web Components that implement the Toolkitchen Toolkit.

The Toolkitchen Toolkit is a new type of library for the web, designed to leverage the existing browser infrastructure to provide the encapsulation and extendability currently only available in JS libraries.

Toolkitchen Toolkit is based on a set of future technologies, including [Shadow DOM](https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html), [Custom Elements](https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/index.html) and Model Driven Views. Currently these technologies are implemented as polyfills or shims, but as browsers adapt these features natively, the platform code that drives Toolkit evacipates, leaving only the value-adds.

## Requirements

Although we plan to support all major evergreen (auto-updating) browsers, **currently Toolkit requires a Webkit browser** (essentially Chrome and Safari). 

Note: although Chromium has native support for ShadowDOM but Toolkit only supports the shim-implementation at this time.

## Getting Started

To enable Custom Element functionality (et al), include the `platform/platform.js` file in your document. The platform code enables the `<link rel="components" href="component.html">` for loading components.

After loading `platform/platform.js`, one can load components with <link> and deploy them using simple HTML. E.g.:

	<!DOCTYPE html>
	<html>
  		<head>
    		<script src="../platform/platform.js"></script>
		    <link rel="components" href="../src/g-toolbar.html">
  		</head>
  		<body>
			<g-toolbar></g-toolbar>
  		</body>
	</html>

A basic example as above is available in `getting_started/index.html`. Also, there are various samples in the `workbench` folder that are intended to exercise the basic components.

## Runtime Concepts