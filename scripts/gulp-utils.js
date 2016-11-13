/**
 * Created by huangsihuan on 2016/11/3.
 */
var through2 = require('through2');
var gutil = require('gulp-util');
var insert = require('gulp-insert');
var nano = require('gulp-cssnano');
var postcss = require('postcss');
var _ = require('lodash');

exports.hoistScssVariables = function() {
    return through2.obj(function(file, enc, next) {
        var contents = file.contents.toString().split('\n');
        var lastVariableLine = -1;

        var openCount = 0;
        var closeCount = 0;
        var openBlock = false;

        for( var currentLine = 0; currentLine < contents.length; ++currentLine) {
            var line = contents[currentLine];

            if (openBlock || /^\s*\$/.test(line) && !/^\s+/.test(line)) {
                openCount += (line.match(/\(/g) || []).length;
                closeCount += (line.match(/\)/g) || []).length;
                openBlock = openCount != closeCount;
                var variable = contents.splice(currentLine, 1)[0];
                contents.splice(++lastVariableLine, 0, variable);
            }
        }
        file.contents = new Buffer(contents.join('\n'));
        this.push(file);
        next();
    });
};



exports.cssToNgConstant = function(ngModule, factoryName) {
    return through2.obj(function(file, enc, next) {

        var template = 'let themeConst = "%3";\n export default  themeConst;\n';
        var output = file.contents.toString().replace(/\n/g, '').replace(/\"/g,'\\"');

        var jsFile = new gutil.File({
            base: file.base,
            path: file.path.replace('css', 'js'),
            contents: new Buffer(
                template.replace('%1', ngModule)
                    .replace('%2', factoryName)
                    .replace('%3', output)
            )
        });

        this.push(jsFile);
        next();
    });
};



// Removes duplicated CSS properties.
exports.dedupeCss = function dedupeCss() {
    var prefixRegex = /-(webkit|moz|ms|o)-.+/;

    return insert.transform(function (contents) {
        // Parse the CSS into an AST.
        var parsed = postcss.parse(contents);

        // Walk through all the rules, skipping comments, media queries etc.
        parsed.eachRule(function (rule) {
            // Skip over any comments, media queries and rules that have less than 2 properties.
            if (rule.type !== 'rule' || !rule.nodes || rule.nodes.length < 2) return;

            // Walk all of the properties within a rule.
            rule.walk(function (prop) {
                // Check if there's a similar property that comes after the current one.
                var hasDuplicate = validateProp(prop) && _.find(rule.nodes, function (otherProp) {
                        return prop !== otherProp && prop.prop === otherProp.prop && validateProp(otherProp);
                    });

                // Remove the declaration if it's duplicated.
                if (hasDuplicate) {
                    prop.remove();

                    gutil.log(gutil.colors.yellow(
                        'Removed duplicate property: "' +
                        prop.prop + ': ' + prop.value + '" from "' + rule.selector + '"...'
                    ));
                }
            });
        });

        // Turn the AST back into CSS.
        return parsed.toResult().css;
    })
};


exports.minifyCss = function (extraOptions) {
    var options = {
        autoprefixer: false,
        reduceTransforms: false,
        svgo: false,
        safe: true
    };

    return nano(_.assign(options, extraOptions));
}
