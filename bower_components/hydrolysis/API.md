<a name="hydrolysis"></a>
## hydrolysis : <code>object</code>
Static analysis for Polymer.

**Kind**: global namespace  

* [hydrolysis](#hydrolysis) : <code>object</code>
  * [.Analyzer](#hydrolysis.Analyzer)
    * [new Analyzer(attachAST, [loader])](#new_hydrolysis.Analyzer_new)
    * _instance_
      * [.elements](#hydrolysis.Analyzer#elements) : <code>Array.&lt;ElementDescriptor&gt;</code>
      * [.elementsByTagName](#hydrolysis.Analyzer#elementsByTagName) : <code>Object.&lt;string, ElementDescriptor&gt;</code>
      * [.features](#hydrolysis.Analyzer#features) : <code>Array.&lt;FeatureDescriptor&gt;</code>
      * [.behaviors](#hydrolysis.Analyzer#behaviors) : <code>Array.&lt;BehaviorDescriptor&gt;</code>
      * [.html](#hydrolysis.Analyzer#html) : <code>Object.&lt;string, AnalyzedDocument&gt;</code>
      * [.dependencies(href)](#hydrolysis.Analyzer#dependencies) ⇒ <code>Array.&lt;string&gt;</code>
      * [.metadataTree(href)](#hydrolysis.Analyzer#metadataTree) ⇒ <code>Promise</code>
      * [.annotate()](#hydrolysis.Analyzer#annotate)
      * [.clean()](#hydrolysis.Analyzer#clean)
    * _static_
      * [.analyze(href, [options])](#hydrolysis.Analyzer.analyze) ⇒ <code>Promise.&lt;Analyzer&gt;</code>
  * [.FileLoader](#hydrolysis.FileLoader)
    * [new FileLoader()](#new_hydrolysis.FileLoader_new)
    * [.addResolver(resolver)](#hydrolysis.FileLoader#addResolver)
    * [.request(url)](#hydrolysis.FileLoader#request) ⇒ <code>Promise.&lt;string&gt;</code>
  * [.FSResolver](#hydrolysis.FSResolver)
    * [new FSResolver(config)](#new_hydrolysis.FSResolver_new)
  * [.NoopResolver](#hydrolysis.NoopResolver)
    * [new NoopResolver(config)](#new_hydrolysis.NoopResolver_new)
    * [.accept(uri, deferred)](#hydrolysis.NoopResolver#accept) ⇒ <code>boolean</code>
  * [.XHRResolver](#hydrolysis.XHRResolver)
    * [new XHRResolver(config)](#new_hydrolysis.XHRResolver_new)
  * [.DocumentAST](#hydrolysis.DocumentAST) : <code>Object</code>
  * [.ElementDescriptor](#hydrolysis.ElementDescriptor) : <code>Object</code>
  * [.FeatureDescriptor](#hydrolysis.FeatureDescriptor) : <code>Object</code>
  * [.BehaviorDescriptor](#hydrolysis.BehaviorDescriptor) : <code>Object</code>
  * [.DocumentDescriptor](#hydrolysis.DocumentDescriptor) : <code>Object</code>
  * [.AnalyzedDocument](#hydrolysis.AnalyzedDocument) : <code>Object</code>
  * [.LoadOptions](#hydrolysis.LoadOptions) : <code>Object</code>
  * [.Resolver](#hydrolysis.Resolver) : <code>Object</code>

<a name="hydrolysis.Analyzer"></a>
### hydrolysis.Analyzer
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  

* [.Analyzer](#hydrolysis.Analyzer)
  * [new Analyzer(attachAST, [loader])](#new_hydrolysis.Analyzer_new)
  * _instance_
    * [.elements](#hydrolysis.Analyzer#elements) : <code>Array.&lt;ElementDescriptor&gt;</code>
    * [.elementsByTagName](#hydrolysis.Analyzer#elementsByTagName) : <code>Object.&lt;string, ElementDescriptor&gt;</code>
    * [.features](#hydrolysis.Analyzer#features) : <code>Array.&lt;FeatureDescriptor&gt;</code>
    * [.behaviors](#hydrolysis.Analyzer#behaviors) : <code>Array.&lt;BehaviorDescriptor&gt;</code>
    * [.html](#hydrolysis.Analyzer#html) : <code>Object.&lt;string, AnalyzedDocument&gt;</code>
    * [.dependencies(href)](#hydrolysis.Analyzer#dependencies) ⇒ <code>Array.&lt;string&gt;</code>
    * [.metadataTree(href)](#hydrolysis.Analyzer#metadataTree) ⇒ <code>Promise</code>
    * [.annotate()](#hydrolysis.Analyzer#annotate)
    * [.clean()](#hydrolysis.Analyzer#clean)
  * _static_
    * [.analyze(href, [options])](#hydrolysis.Analyzer.analyze) ⇒ <code>Promise.&lt;Analyzer&gt;</code>

<a name="new_hydrolysis.Analyzer_new"></a>
#### new Analyzer(attachAST, [loader])
A database of Polymer metadata defined in HTML


| Param | Type | Description |
| --- | --- | --- |
| attachAST | <code>boolean</code> | If true, attach a parse5 compliant AST |
| [loader] | <code>FileLoader</code> | An optional `FileLoader` used to load external                              resources |

<a name="hydrolysis.Analyzer#elements"></a>
#### analyzer.elements : <code>Array.&lt;ElementDescriptor&gt;</code>
A list of all elements the `Analyzer` has metadata for.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer#elementsByTagName"></a>
#### analyzer.elementsByTagName : <code>Object.&lt;string, ElementDescriptor&gt;</code>
A view into `elements`, keyed by tag name.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer#features"></a>
#### analyzer.features : <code>Array.&lt;FeatureDescriptor&gt;</code>
A list of API features added to `Polymer.Base` encountered by the
analyzer.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer#behaviors"></a>
#### analyzer.behaviors : <code>Array.&lt;BehaviorDescriptor&gt;</code>
The behaviors collected by the analysis pass.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer#html"></a>
#### analyzer.html : <code>Object.&lt;string, AnalyzedDocument&gt;</code>
A map, keyed by absolute path, of Document metadata.

**Kind**: instance property of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer#dependencies"></a>
#### analyzer.dependencies(href) ⇒ <code>Array.&lt;string&gt;</code>
List all the html dependencies for the document at `href`.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - A list of all the html dependencies.  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | The href to get dependencies for. |

<a name="hydrolysis.Analyzer#metadataTree"></a>
#### analyzer.metadataTree(href) ⇒ <code>Promise</code>
Returns a promise that resolves to a POJO representation of the import
tree, in a format that maintains the ordering of the HTML imports spec.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | the import to get metadata for. |

<a name="hydrolysis.Analyzer#annotate"></a>
#### analyzer.annotate()
Annotates all loaded metadata with its documentation.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer#clean"></a>
#### analyzer.clean()
Removes redundant properties from the collected descriptors.

**Kind**: instance method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
<a name="hydrolysis.Analyzer.analyze"></a>
#### Analyzer.analyze(href, [options]) ⇒ <code>Promise.&lt;Analyzer&gt;</code>
Shorthand for transitively loading and processing all imports beginning at
`href`.

In order to properly filter paths, `href` _must_ be an absolute URI.

**Kind**: static method of <code>[Analyzer](#hydrolysis.Analyzer)</code>  
**Returns**: <code>Promise.&lt;Analyzer&gt;</code> - A promise that will resolve once `href` and its
    dependencies have been loaded and analyzed.  

| Param | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | The root import to begin loading from. |
| [options] | <code>LoadOptions</code> | Any additional options for the load. |

<a name="hydrolysis.FileLoader"></a>
### hydrolysis.FileLoader
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  

* [.FileLoader](#hydrolysis.FileLoader)
  * [new FileLoader()](#new_hydrolysis.FileLoader_new)
  * [.addResolver(resolver)](#hydrolysis.FileLoader#addResolver)
  * [.request(url)](#hydrolysis.FileLoader#request) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_hydrolysis.FileLoader_new"></a>
#### new FileLoader()
A FileLoader lets you resolve URLs with a set of potential resolvers.

<a name="hydrolysis.FileLoader#addResolver"></a>
#### fileLoader.addResolver(resolver)
Add an instance of a Resolver class to the list of url resolvers

Ordering of resolvers is most to least recently added
The first resolver to "accept" the url wins.

**Kind**: instance method of <code>[FileLoader](#hydrolysis.FileLoader)</code>  

| Param | Type | Description |
| --- | --- | --- |
| resolver | <code>Resolver</code> | The resolver to add. |

<a name="hydrolysis.FileLoader#request"></a>
#### fileLoader.request(url) ⇒ <code>Promise.&lt;string&gt;</code>
Return a promise for an absolute url

Url requests are deduplicated by the loader, returning the same Promise for
identical urls

**Kind**: instance method of <code>[FileLoader](#hydrolysis.FileLoader)</code>  
**Returns**: <code>Promise.&lt;string&gt;</code> - A promise that resolves to the contents of the URL.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The absolute url to request. |

<a name="hydrolysis.FSResolver"></a>
### hydrolysis.FSResolver
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  
<a name="new_hydrolysis.FSResolver_new"></a>
#### new FSResolver(config)
Resolves requests via the file system.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | configuration options. |
| config.host | <code>string</code> | Hostname to match for absolute urls.     Matches "/" by default |
| config.basePath | <code>string</code> | Prefix directory for components in url.     Defaults to "/". |
| config.root | <code>string</code> | Filesystem root to search. Defaults to the     current working directory. |

<a name="hydrolysis.NoopResolver"></a>
### hydrolysis.NoopResolver
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  

* [.NoopResolver](#hydrolysis.NoopResolver)
  * [new NoopResolver(config)](#new_hydrolysis.NoopResolver_new)
  * [.accept(uri, deferred)](#hydrolysis.NoopResolver#accept) ⇒ <code>boolean</code>

<a name="new_hydrolysis.NoopResolver_new"></a>
#### new NoopResolver(config)
A resolver that resolves to null any uri matching config.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>string</code> | The url to `accept`. |

<a name="hydrolysis.NoopResolver#accept"></a>
#### noopResolver.accept(uri, deferred) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[NoopResolver](#hydrolysis.NoopResolver)</code>  
**Returns**: <code>boolean</code> - Whether the URI is handled by this resolver.  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The absolute URI being requested. |
| deferred | <code>Deferred</code> | The deferred promise that should be resolved if     this resolver handles the URI. |

<a name="hydrolysis.XHRResolver"></a>
### hydrolysis.XHRResolver
**Kind**: static class of <code>[hydrolysis](#hydrolysis)</code>  
<a name="new_hydrolysis.XHRResolver_new"></a>
#### new XHRResolver(config)
Construct a resolver that requests resources over XHR.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | configuration arguments. |
| config.responseType | <code>string</code> | Type of object to be returned by the     XHR. Defaults to 'text', accepts 'document', 'arraybuffer', and 'json'. |

<a name="hydrolysis.DocumentAST"></a>
### hydrolysis.DocumentAST : <code>Object</code>
Parse5's representation of a parsed html document

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.ElementDescriptor"></a>
### hydrolysis.ElementDescriptor : <code>Object</code>
The metadata for a single polymer element

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.FeatureDescriptor"></a>
### hydrolysis.FeatureDescriptor : <code>Object</code>
The metadata for a Polymer feature.

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.BehaviorDescriptor"></a>
### hydrolysis.BehaviorDescriptor : <code>Object</code>
The metadata for a Polymer behavior mixin.

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
<a name="hydrolysis.DocumentDescriptor"></a>
### hydrolysis.DocumentDescriptor : <code>Object</code>
The metadata for all features and elements defined in one document

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| elements | <code>Array.&lt;ElementDescriptor&gt;</code> | The elements from the document |
| features | <code>Array.&lt;FeatureDescriptor&gt;</code> | The features from the document |
| behaviors | <code>Array.&lt;FeatureDescriptor&gt;</code> | The behaviors from the document |

<a name="hydrolysis.AnalyzedDocument"></a>
### hydrolysis.AnalyzedDocument : <code>Object</code>
The metadata of an entire HTML document, in promises.

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | The url of the document. |
| htmlLoaded | <code>Promise.&lt;ParsedImport&gt;</code> | The parsed representation of     the doc. Use the `ast` property to get the full `parse5` ast |
| depsLoaded | <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> | Resolves to the list of this     Document's import dependencies |
| metadataLoaded | <code>Promise.&lt;DocumentDescriptor&gt;</code> | Resolves to the list of     this Document's import dependencies |

<a name="hydrolysis.LoadOptions"></a>
### hydrolysis.LoadOptions : <code>Object</code>
Options for `Analyzer.analzye`

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| attachAST | <code>boolean</code> | Whether underlying AST data should be included. |
| noAnnotations | <code>boolean</code> | Whether `annotate()` should be skipped. |
| clean | <code>boolean</code> | Whether the generated descriptors should be cleaned     of redundant data. |
| filter | <code>function</code> | A predicate function that     indicates which files should be ignored by the loader. By default all     files not located under the dirname of `href` will be ignored. |

<a name="hydrolysis.Resolver"></a>
### hydrolysis.Resolver : <code>Object</code>
An object that knows how to resolve resources.

**Kind**: static typedef of <code>[hydrolysis](#hydrolysis)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| accept | <code>function</code> | Attempt to resolve     `deferred` with the contents the specified URL. Returns false if the     Resolver is unable to resolve the URL. |

