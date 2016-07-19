# auto-inject-webpack
this is a Webpack plugin that can auto inject script label and style links into your html, useful in multi-entry project.

## usage

install this plugin via npm:
```
npm install auto-inject-webpack-plugin -D
```

in your webpack.config.js:
```javascript
var path               = require('path');
var webpack            = require('webpack');
var autoInjectPlugin   = require('auto-inject-webpack-plugin');
var commonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = function () {
  return {
    entry: [
      "bundle": path.join(__dirname, '/res/index.js')
    ],
    output:{
      path: path.join(__dirname, '/dist/'),
      filename: '[name].min.js'
    },
    module: {
      loders: [
        ...
      ]
    },
    plugins: [
      new commonsChunkPlugin({ // if you are not using commonChunks, leave this empty.
        name:      'commons',
				chunks:    options.entries,
				minChunks: options.entries.length
      }),
      new autoInjectPlugin({
        outputURI: '/dist/',
        commonChunks: 'commons', // name of commonsChunk.
      }),
      ...
    ]
  }
}
```

in your entry file (/res/index.js as above):
```javascript
/* %/view/index.html% */
// your code...
```

in your html file (/view/index.html):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <!-- css-begin -->
  <!-- css-end -->
</head>
<body>
  <!-- js-begin -->
  <!-- js-end -->
</body>
</html>
```
final html:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <!-- css-begin -->
  <!-- css-end -->
</head>
<body>
  <!-- js-begin -->
<script src="/dist/bundle.min.js"></script>
<!-- js-end -->
</body>
</html>
```

## options

* `outputURI`: server URI of your webpack output folder.
  + default: `"/static/build/"`.

* `htmlPlaceholder`: RegExp to match your html path (relative path from package.json) which is designated in your entry file.
  + default: `/\/\*\s*\%(.+)+\%\s*\*\//` which represents `/* %/path/of/your/htmlfile.html% */`.

* `jsPlaceholderBegin`: begin anchor to decide where to inject your script labels. (this anchor is designated in your html file)
  + default: `"<!-- js-begin -->"`

* `jsPlaceholderEnd`: end anchor to decide where to inject your script labels. (this anchor is designated in your html file)
  + default: `"<!-- js-end -->"`

* `cssPlaceholderBegin`: begin anchor to decide where to inject your style link labels. (this anchor is designated in your html file)
  + default: `"<!-- css-begin -->"`

* `cssPlaceholderBegin`: end anchor to decide where to inject your style link labels. (this anchor is designated in your html file)
  + default: `"<!-- css-end -->"`
