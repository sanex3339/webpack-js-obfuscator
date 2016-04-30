"use strict";

declare let module: any;
declare let require: any;

let RawSource: any = require('webpack-core/lib/RawSource'),
    jsObfuscator: any = require('js-obfuscator'),
    multimatch: any = require('multimatch'),
    gutil: any = require('gulp-util'),
    PluginError: any = gutil['PluginError'];

class WebpackJsObfuscator {
    public options: any = {};
    public excludes: string[];

    private PLUGIN_NAME: string = 'webpack-js-obfuscator';

    constructor (options: any, excludes: string|string[]) {
        this.options = options;
        this.excludes = typeof excludes === 'string' ? [excludes] : excludes || [];
    }

    public apply (compiler: any) {
        compiler.plugin('compilation', (compilation: any) => {
            compilation.plugin("optimize-chunk-assets", async (chunks: any[], callback: () => void) => {
                let files = [];

                chunks.forEach((chunk) => {
                    chunk['files'].forEach((file) => {
                        files.push(file);
                    });
                });

                compilation.additionalChunkAssets.forEach((file) => {
                    files.push(file);
                });

                await Promise.all(files.map(async (file) => {
                    if (WebpackJsObfuscator.shouldExclude(file, this.excludes)) {
                        return;
                    }

                    let asset = compilation.assets[file];

                    compilation.assets[file] = await this.obfuscate(asset, this.options);
                }));

                callback();
            });
        });
    }

    private obfuscate (asset: any, options: any) {
        return new Promise((resolve, reject) => {
            jsObfuscator(asset.source(), options).then((result) => {
                resolve(new RawSource(result));
            }).catch((err) => {
                reject(new PluginError(this.PLUGIN_NAME, err));
            });
        })
    }

    private static shouldExclude (filePath: string, excludes: string[]) {
        for (var i = 0; i < excludes.length; i++) {
            if (multimatch(filePath, excludes[i]).length > 0) {
                return true;
            }
        }

        return false;
    }
}

module.exports = WebpackJsObfuscator;
