export default function datatableService(){

  function tablescrollEvent(elm) {
    var fixlefttable = elm.querySelector('.ks-table-fixleft-container');
    var fixrighttable = elm.querySelector('.ks-table-fixright-container');


    return (e)=>{
      console.info('fixrighttable' ,elm)
      e.preventDefault();
      var target = e.target ,scrollWidth,offsetWidth;
      var scrollWidth = target.scrollWidth;
      var offsetWidth = target.offsetWidth;
      var scrolldis = target.scrollLeft;
      var statusleft = scrolldis === 0;
      var statusright = (offsetWidth+scrolldis === scrollWidth);
      var statusmiddle = !(statusleft || statusright);
      if(statusleft){
        if(fixlefttable) fixlefttable.classList.remove('fix-shadow');
        if(fixrighttable) fixrighttable.classList.add('fix-shadow');
      }
      if(statusmiddle){
        if(fixlefttable) fixlefttable.classList.add('fix-shadow');
        if(fixrighttable) fixrighttable.classList.add('fix-shadow');
      }
      if(statusright){
        if(fixlefttable) fixlefttable.classList.add('fix-shadow');
        if(fixrighttable) fixrighttable.classList.remove('fix-shadow');
      }
    }
  }
  this.addScrollEvent = function(elm){
    if(!elm) return;
    var scrollEvent = tablescrollEvent(elm);

    var kstable = elm.querySelector('.ks-table-container');
    kstable.addEventListener('scroll',scrollEvent);
  }


  this.selectAll = function(){


  }

  this.fixRightColDefs = function(colDefs){
      // console.info('rightfilter' ,colDefs)
      var i,l;i = l =colDefs.length;
      while(i > 0){
        if(colDefs[i-1].fixed === 'true') i--;
        else {
          return Array.prototype.slice.call(colDefs,i,l);
        }
      }
      return colDefs;
  }

  this.fixLeftColDefs = function(colDefs){
    var i = 0 ,l =colDefs.length;
    while(i < l){
      if(colDefs[i].fixed === 'true') i++;
      else {
        return Array.prototype.slice.call(colDefs,0,i);
      }
    }
    return colDefs;

  }

}

