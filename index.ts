"use strict";

declare let module: any;
declare let require: any;

let RawSource = require('webpack-core/lib/RawSource'),
    jsObfuscator = require('js-obfuscator'),
    multimatch = require('multimatch'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

class WebpackJsObfuscator {
    public options: any = {};
    public excludes: any;

    private PLUGIN_NAME: string = 'webpack-js-obfuscator';

    constructor (options, excludes) {
        this.options = options;
        this.excludes = typeof excludes === 'string' ? [excludes] : excludes || [];
    }

    public apply (compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin("optimize-chunk-assets", async (chunks, callback) => {
                let files = [];

                chunks.forEach((chunk) => {
                    chunk.files.forEach((file) => {
                        files.push(file);
                    });
                });

                compilation.additionalChunkAssets.forEach((file) => {
                    files.push(file);
                });

                await Promise.all(files.map(async (file) => {
                    if (this.shouldExclude(file, this.excludes)) {
                        return;
                    }

                    let asset = compilation.assets[file];

                    compilation.assets[file] = await this.obfuscate(asset, this.options);
                }));

                callback();
            });
        });
    }

    private obfuscate (asset, options) {
        return new Promise((resolve, reject) => {
            jsObfuscator(asset.source(), options).then((result) => {
                resolve(new RawSource(result));
            }).catch((err) => {
                reject(new PluginError(this.PLUGIN_NAME, err));
            });
        })
    }

    private shouldExclude (filePath, excludes) {
        for (var i = 0; i < excludes.length; i++) {
            if (multimatch(filePath, excludes[i]).length > 0) {
                return true;
            }
        }

        return false;
    }
}

module.exports = WebpackJsObfuscator;
