# auto-inject-webpack
this is a Webpack plugin that can auto inject script label and style links into your html.

## options
* `outputURI`: server URI of your webpack output folder. eg. "/static/build/".
* `htmlPlaceholder`: RegExp to match your html path (relative path from package.json) which is designated in your entry file. default: `/\/\*\s*\%(.+)+\%\s*\*\//` which represents `/* %/path/of/your/htmlfile.html% */`.
* `jsPlaceholderBegin`: begin anchor to decide where to inject your script labels. (this anchor is designated in your html file) default: `"<!-- js-begin -->"`
* `jsPlaceholderEnd`: end anchor to decide where to inject your script labels. (this anchor is designated in your html file) default: `"<!-- js-end -->"`
* `cssPlaceholderBegin`: begin anchor to decide where to inject your style link labels. (this anchor is designated in your html file) default: `"<!-- css-begin -->"`
* `cssPlaceholderBegin`: end anchor to decide where to inject your style link labels. (this anchor is designated in your html file) default: `"<!-- css-end -->"`
