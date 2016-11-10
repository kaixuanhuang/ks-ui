var gulp = require('gulp');
var scss = require('gulp-sass');
var concat = require('gulp-concat');
var gulputil = require('./scripts/gulp-utils');


gulp.task('default' ,['build-theme','build-scss' ] ,function(){

});

gulp.task('build-scss' ,[] ,function(){

    gulp.src([
        './src/components/**/*.scss'
    ])
        .pipe(scss())
        .pipe(concat('ks-component.css'))
        .pipe(gulp.dest('./app/bundle'))

})


// builds the theming related css and provides it as a JS const for angular
function themeBuildStream() {
    gulp.src( [
        'src/components/theme/styles/*.scss' ,
        'src/components/**/*-theme.scss'
    ])
        .pipe(concat('default-theme.scss'))
        .pipe(gulputil.hoistScssVariables())
        .pipe(scss())
        .pipe(gulputil.dedupeCss())
        // The PostCSS orderedValues plugin modifies the theme color expressions.
        .pipe(gulputil.minifyCss({ orderedValues: false }))
        .pipe(gulputil.cssToNgConstant('material.core', '$MD_THEME_CSS'))
        .pipe(concat('ks-theme.js'))
        .pipe(gulp.dest('./app/bundle'));

}

gulp.task('build-theme' ,[],themeBuildStream)


var   jsBaseFiles =  [
        'src/components/**/*.js',
        'src/core/**/*.js',
        ];

function buildJs () {
    var jsFiles = jsBaseFiles.concat([path.join(config.paths, '*.js')]);

    gutil.log("building js files...",jsFiles);

    var jsBuildStream = gulp.src( jsFiles )
        .pipe(filterNonCodeFiles())
        .pipe(utils.buildNgMaterialDefinition())
        .pipe(plumber())
        //.pipe(ngAnnotate())
        .pipe(utils.addJsWrapper(true));

    var jsProcess = series(jsBuildStream, themeBuildStream() )
        .pipe(concat('angular-material.js'))
        .pipe(BUILD_MODE.transform())
        .pipe(insert.prepend(config.banner))
        .pipe(insert.append(';window.ngMaterial={version:{full: "' + VERSION +'"}};'))
        .pipe(gulp.dest(config.outputDir))
        .pipe(gulpif(!IS_DEV, uglify({ preserveComments: 'some' })))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(config.outputDir));

}


