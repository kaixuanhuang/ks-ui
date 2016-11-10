(function (global) {

    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            app: 'src',
            'rxjs': 'npm:rxjs',
            'angular-material':'dist/angular-material.min.js',
            'angular':'npm:angular/angular.js',
            'angular-messages':'npm:angular-messages/angular-messages.min.js',
            'angular-animate':'npm:angular-animate/angular-animate.min.js',
            'angular-aria':'npm:angular-aria/angular-aria.min.js',
            'ngcomponentRouter':'npm:@angular/router/angular1/angular_1_router.js',
            'router-shim':'npm:@angular/router/angular1/ng_route_shim.js',
            'angular_router_shim':'npm:@angular/router/angular1/ng_router_shim.js',
            'angular-jwt':'npm:angular-jwt/dist/angular-jwt.min.js',
            'angular-storage':'npm:angular-storage/dist/angular-storage.min.js',
            'rxjs': 'npm:rxjs',
            'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
            'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js',
            'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
            'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js',
        },
        //  ES6  FEATURE
        transpiler: 'plugin-babel',
        meta: {
            '*.js': {
                babelOptions: {
                    stage1: true
                }
            },
        },

        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './boot/boot.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
        }
    });
})(this);
