iron-ajax
=========

The `iron-ajax` element exposes network request functionality.

```html
<iron-ajax
    auto
    url="http://gdata.youtube.com/feeds/api/videos/"
    params='{"alt":"json", "q":"chrome"}'
    handle-as="json"
    on-response="handleResponse"></iron-ajax>
```

With `auto` set to `true`, the element performs a request whenever
its `url`, `params` or `body` properties are changed. Automatically generated
requests will be debounced in the case that multiple attributes are changed
sequentially.

Note: The `params` attribute must be double quoted JSON.

You can trigger a request explicitly by calling `generateRequest` on the
element.
