var fs = require('fs');
var path = require('path');

var CHAR_CODE = 'utf8';

function pluginDemo(options) {
    this.options = options;
    this.options.outputURI            = options.outputURI           || "/";
    this.options.htmlPlaceholder      = options.htmlPlaceholder     || /\/\*\s*\%(.+)+\%\s*\*\//;
    this.options.jsPlaceholderBegin   = options.jsPlaceholderBegin  || "<!-- js-begin -->";
    this.options.jsPlaceholderEnd     = options.jsPlaceholderEnd    || "<!-- js-end -->";
    this.options.cssPlaceholderBegin  = options.cssPlaceholderBegin || "<!-- css-begin -->";
    this.options.cssPlaceholderEnd    = options.cssPlaceholderEnd   || "<!-- css-end -->";
    this.runOnce = false;
}


function getInitializeAssets() {
    return {
        'css': [],
        'js': []
    }
}


function structureAssets(fileList) {
    var assets = getInitializeAssets();

    fileList.forEach(function(el) {
        switch(true) {
            case /\.js$/.test(el):
                assets['js'].push(el);
                break;
            case /\.css$/.test(el):
                assets['css'].push(el);
                break;
        }
    }, this);

    return assets;
}


function getChunkFiles(name, namedChunks) {
    return namedChunks[name] && namedChunks[name].files || [];
}


function getCommonAssets(commonChunks, namedChunks) {
    var assets = getInitializeAssets();

    if (typeof commonChunks === 'string') {
        assets = structureAssets(getChunkFiles(commonChunks, namedChunks));
    } else if (Array.isArray(commonChunks)) {
        commonChunks.forEach(function(chunk) {
            var _files = getChunkFiles(chunk, namedChunks);
            var _assets = structureAssets(_files);
            assets['js'] = assets['js'].concat(_assets['js']);
            assets['css'] = assets['css'].concat(_assets['css']);
        }, this);
    }

    return assets;
}


function createJsLabel(basePath, jsPath) {
    return '<script src="' + path.join(basePath, jsPath) + '"></script>';
}


function createCssLabel(basePath, cssPath) {
    return '<link rel="stylesheet" href="' + path.join(basePath, cssPath) + '"/>';
}


function replaceWithin(str, matchBegin, matchEnd, strNew) {
    var index0, index1;

    if (!matchBegin || !matchEnd) {
        return str;
    }

    index0 = str.indexOf(matchBegin);
    index1 = str.indexOf(matchEnd);

    if (index0 < 0 || index1 < 0) {
        return str;
    } else {
        return str.substr(0, index0 + matchBegin.length)
                + strNew
                + str.substr(index1);
    }
}


pluginDemo.prototype.apply = function (compiler) {

    var _this = this;
    var entry = compiler.options.entry;

    compiler.plugin('emit', function (compilation, callback) {

        var opt                     = _this.options;
        var namedChunks             = compilation.namedChunks;
        var commonChunks            = opt.commonChunks;
        var outputURI               = opt.outputURI;
        var htmlPlaceholder         = opt.htmlPlaceholder;
        var jsPlaceholderBegin      = opt.jsPlaceholderBegin;
        var jsPlaceholderEnd        = opt.jsPlaceholderEnd;
        var cssPlaceholderBegin     = opt.cssPlaceholderBegin;
        var cssPlaceholderEnd       = opt.cssPlaceholderEnd;
        var assetsCommon            = getCommonAssets(commonChunks, namedChunks);


        if (_this.runOnce) {
            callback();
            return;
        }

        for (var module in entry) {
            if (entry.hasOwnProperty(module)) {

                var entryFile = fs.readFileSync(entry[module], CHAR_CODE);
                var htmlMatched = entryFile.match(htmlPlaceholder);
                var htmlPath = "";

                if (htmlMatched && htmlMatched.length && htmlMatched[1]) {
                    htmlPath = path.resolve(__dirname, htmlMatched[1]);
                } else {
                    continue;
                }

                var assets = structureAssets(getChunkFiles(module, namedChunks));

                var labelJs = assetsCommon['js'].concat(assets['js']).map(function(path) {
                    return createJsLabel(outputURI, path)
                }).join('\n');

                var labelCss = assetsCommon['css'].concat(assets['css']).map(function(path) {
                    return createCssLabel(outputURI, path)
                }).join('\n');

                var _data = fs.readFileSync(htmlPath, CHAR_CODE);

                _data = replaceWithin(_data, jsPlaceholderBegin, jsPlaceholderEnd, '\n' + labelJs + '\n');
                _data = replaceWithin(_data, cssPlaceholderBegin, cssPlaceholderEnd, '\n' + labelCss + '\n');

                fs.writeFileSync(htmlPath, _data, CHAR_CODE);
            }
        }

        _this.runOnce = true;
        callback();
    });

};

module.exports = pluginDemo;

