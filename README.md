
Application Architecture
-------------

* RactiveJS - This is the core renderer and allows us to write Handlebars syntax.
* Backbone - for Models and Collections. This cleanly abstracts HTTP requests for saving, updating, and fetching data.
* Bootstrap 4 - This is great for responsive layouts and utilities for padding, margin, colors, etc.

Build Process
-------------

We're using Webpack2 for our client-side build process. This allows us to write in ES6 via Babel and Sass for CSS. This outputs minified JS and CSS files with source maps. We've also configured Webpack to precompile our Ractive templates from HTML to JS functions.