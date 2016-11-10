#水波纹实现思路
  cursor: pointer;//  让用户知道是可点击的
  user-select: none; //让文字不可选
  -webkit-tap-highlight-color: transparent;//ios

  vertical-align: middle;
  will-change: opacity, transform;//优化ie不支持


  ripple粉末登场

  首先创建一个半径为20px的 重量为0 的 圆波纹
      position: absolute;  //关键  这样才能将插入的波纹定位到指定的
      border-radius: 50%;
      width: 20px;
      height: 20px;

      opacity: 0;

            margin-top:-10px;
            margin-left:-10px;

             //在想要产生波纹效果的的元素 后插入波纹，波纹展开后将其移除

                        var el = element || this;
                        // Create ripple
                        var ripple = document.createElement('div');
                        ripple.className = 'waves-ripple';
                        el.appendChild(ripple);

              //获取点击坐标 及元素宽度

                          var pos         = offset(el);
                          var relativeY   = (e.pageY - pos.top);
                          var relativeX   = (e.pageX - pos.left);
                          var scale       = 'scale('+((el.clientWidth / 100) * 10)+')';
                          //因为我们要将插入的波纹元素 定位到鼠标点击位置


                          //我们目前的条件有
                          //产生点击事件的元素  正好是效果元素-> 那么根据offsetX,offSetY即可得到 绝对定位的 top left
                          //如果点击事件实在子元素产生srcElemnet !== $element 我们需要用client - $element的图层 rect 得到定位的  top，left