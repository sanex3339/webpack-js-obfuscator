#JSObfuscator plugin for Webpack

###Installation

Install the package with NPM and add it to your devDependencies:

`npm install --save-dev webpack-js-obfuscator`

###Usage:

```javascript
var WebpackJsObfuscator = require('webpack-js-obfuscator');

// ...

// webpack plugins array
plugins: [
	new UglifyJsPlugin(), // better to use with UglifyJsPlugin
	new WebpackJsObfuscator({}, ['excluded_bundle_name.js'])
],
```

###obfuscatorOptions
Type: `Object` Default: `null`

Options for [js-obfuscator](https://github.com/caiguanhao/js-obfuscator). Should be passed exactly like described on their page.

###excludes
Type: `Array` or `String` Default: `[]`

Examples: `['excluded_bundle_name.js', '**_bundle_name.js']` or `'excluded_bundle_name.js'`

Can be used to bypass obfuscation of some files.