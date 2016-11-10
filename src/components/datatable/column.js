export default function columnDirective(){

  return {
    require:'^^ksTable',
    link: function postLink($scope,$element,$attrs,$tableCtrl){
        console.log('%c 3');
      var colDefs = {};
      colDefs.text = $attrs.text;
      colDefs.field = $attrs.field;
      colDefs.render = $attrs.render;
      colDefs.fixed = $attrs.fixed;
      colDefs.width = $attrs.width?$attrs.width:200
      console.log("%c coldef = " ,'color:red',colDefs)
      $tableCtrl.pushColumnsDef(colDefs);
    }


  }
}
