#JS-Obfuscator plugin for Webpack

###Installation

Install the package with NPM and add it to your devDependencies:

`npm install --save-dev gulp-js-obfuscator`

###Usage:

```javascript
var WebpackJsObfuscator = require('webpack-js-obfuscator');

// ...

// webpack plugins array
plugins: [
	new UglifyJsPlugin(), // better to use with UglifyJsPlugin
	new WebpackJsObfuscator()
],
```

###obfuscatorOptions
Type: `Object` Default: `null`

Options for [js-obfuscator](https://github.com/caiguanhao/js-obfuscator). Should be passed exactly like described on their page.

###excludes
Type: `Array` or `String` Default: `[]`

Examples: `["**/jquery-*.js", "**/*.min.js"]` or `"**/jquery-*.js"`

Can be used to bypass obfuscation of some files.