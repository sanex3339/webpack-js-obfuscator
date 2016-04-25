"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
let RawSource = require('webpack-core/lib/RawSource'), jsObfuscator = require('js-obfuscator'), multimatch = require('multimatch'), gutil = require('gulp-util'), PluginError = gutil.PluginError;
class WebpackJsObfuscator {
    constructor(options, excludes) {
        this.options = {};
        this.PLUGIN_NAME = 'webpack-js-obfuscator';
        this.options = options;
        this.excludes = typeof excludes === 'string' ? [excludes] : excludes || [];
    }
    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin("optimize-chunk-assets", (chunks, callback) => __awaiter(this, void 0, void 0, function* () {
                let files = [];
                chunks.forEach((chunk) => {
                    chunk.files.forEach((file) => {
                        files.push(file);
                    });
                });
                compilation.additionalChunkAssets.forEach((file) => {
                    files.push(file);
                });
                yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    if (this.shouldExclude(file, this.excludes)) {
                        return;
                    }
                    let asset = compilation.assets[file];
                    compilation.assets[file] = yield this.obfuscate(asset, this.options);
                })));
                callback();
            }));
        });
    }
    obfuscate(asset, options) {
        return new Promise((resolve, reject) => {
            jsObfuscator(asset.source(), options).then((result) => {
                resolve(new RawSource(result));
            }).catch((err) => {
                reject(new PluginError(this.PLUGIN_NAME, err));
            });
        });
    }
    shouldExclude(filePath, excludes) {
        for (var i = 0; i < excludes.length; i++) {
            if (multimatch(filePath, excludes[i]).length > 0) {
                return true;
            }
        }
        return false;
    }
}
module.exports = WebpackJsObfuscator;
//# sourceMappingURL=index.js.map