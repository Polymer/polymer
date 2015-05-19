marked-element
==============

Element wrapper for the [marked](http://marked.org/) library.

`<marked-element>` accepts Markdown source either via its `markdown` attribute:

    <marked-element markdown="`Markdown` is _awesome_!"></marked-element>

Or, you can provide it via a `<script type="text/markdown">` element child:

    <marked-element>
      <script type="text/markdown">
        Check out my markdown!

        We can even embed elements without fear of the HTML parser mucking up their
        textual representation:

        ```html
        <awesome-sauce>
          <div>Oops, I'm about to forget to close this div.
        </awesome-sauce>
        ```
      </script>
    </marked-element>

Note that the `<script type="text/markdown">` approach is _static_. Changes to
the script content will _not_ update the rendered markdown!
