import kscomponent from '../components/index';

angular
    .element(document)
    .ready( function() {
        angular
            .module( 'app-bootstrap', ['material.core.theming','material.core.theming.palette',kscomponent.name] )
            .run(()=>{

                console.log(`APP START`);
            })
            .config(($mdThemingProvider)=>{
                "use strict";
                console.info($mdThemingProvider)
                    $mdThemingProvider
                      .theme('default')
                      .primaryPalette('blue')
                      .accentPalette('teal')
                      .warnPalette('red')
                      .backgroundPalette('grey');
            })
            .controller('TestController' ,TestController)
        ;

        let body = document.getElementsByTagName("body")[0];
        angular.bootstrap( body, [ 'app-bootstrap' ]);

    });

function TestController(){
    var $ctrl = this;
    "use strict";
    $ctrl.dataprovider = [{a:'a',b:'b' ,c:'c'},{a:'a',b:'b' ,c:'c'},{a:'a',b:'b' ,c:'c'},{a:'a',b:'b' ,c:'c'},{a:'a',b:'b' ,c:'c'},{a:'a',b:'b' ,c:'c'},{a:'a',b:'b' ,c:'c'},{a:'a',b:'b' ,c:'c'}];
    $ctrl.selected= [ $ctrl.dataprovider[0]];
    console.info('$ctrl.selected' ,$ctrl)
    $ctrl.submit = function(){
        console.log('submit' ,$ctrl)
    }
    $ctrl.active = function(a){
        console.log('adsadsa' ,a)
    }

    $ctrl.codeTables = [{id:1,text:'sad'},{id:2,text:'dsada'}];
    $ctrl.a =1

    $ctrl.formData = {
        a:'1',
    }
}