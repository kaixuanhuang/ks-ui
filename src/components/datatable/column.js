export default function columnDirective(){
  return {
    require:'^^ksTable',
    scope:{},
    link: function postLink(scope,element,attrs,tableCtrl){
        console.log('%c 3');
      var colDefs = {};
      colDefs.text = attrs.text;
      colDefs.field = attrs.field;
      colDefs.render = scope.renderTemp;
      colDefs.fixed = attrs.fixed;
      colDefs.width = attrs.width?attrs.width:200
      console.log("%c coldef = " ,'color:red',colDefs)
      tableCtrl.pushColumnsDef(colDefs);
    },
    controller:['$scope',function Controller($scope){
      this.addRender =function(renderTemp){
        $scope.renderTemp = renderTemp;
      }

      $scope.$on('$destroy' , ()=>{
        console.info('destroy')
      })
    }]


  }
}
