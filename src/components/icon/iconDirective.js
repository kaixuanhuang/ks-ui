
export default function mdIconDirective($mdIcon, $mdTheming,$$mdSvgRegistry) {

  return {
    restrict: 'E',
    link : postLink
  };


  /**
   * Directive postLink
   * Supports embedded SVGs, font-icons, & external SVGs
   */
  function postLink(scope, element, attr) {
    $mdTheming(element);
    var lastFontIcon = attr.mdFontIcon;
    var lastFontSet = $mdIcon.fontSet(attr.mdFontSet);

    prepareForFontIcon();

    attr.$observe('mdFontIcon', fontIconChanged);
    attr.$observe('mdFontSet', fontIconChanged);

    // Keep track of the content of the svg src so we can compare against it later to see if the
    // attribute is static (and thus safe).
    console.info('iconattr' ,attr);
    var originalSvgSrc = element[0].getAttribute(attr.$attr.mdSvgSrc);
     console.info('originalSvgSrc' ,originalSvgSrc);
    // If using a font-icon, then the textual name of the icon itself
    // provides the aria-label.

    var label = attr.alt || attr.mdFontIcon || attr.mdSvgIcon || element.text();
    var attrName = attr.$normalize(attr.$attr.mdSvgIcon || attr.$attr.mdSvgSrc || '');
    if ( !attr['aria-label'] ) {

    }

    if (attrName) {
      // Use either pre-configured SVG or URL source, respectively.
      attr.$observe(attrName, function(attrVal) {
        element.empty();
        if (attrVal) {
          $mdIcon(attrVal)
            .then( svg=>{
              console.info('return  svg' ,svg)
              element.empty();element.append(svg);
             } ,reason=>{
              console.info('%c return  svg fail' ,'color:red' ,reason)
            });
        }

      });
    }

    function parentsHaveText() {
      var parent = element.parent();
      if (parent.attr('aria-label') || parent.text()) {
        return true;
      }
      else if(parent.parent().attr('aria-label') || parent.parent().text()) {
        return true;
      }
      return false;
    }

    function prepareForFontIcon() {
      if (!attr.mdSvgIcon && !attr.mdSvgSrc) {
        if (attr.mdFontIcon) {
          element.addClass('md-font ' + attr.mdFontIcon);
        }

        element.addClass(lastFontSet);
      }
    }

    function fontIconChanged() {
      if (!attr.mdSvgIcon && !attr.mdSvgSrc) {
        if (attr.mdFontIcon) {
          element.removeClass(lastFontIcon);
          element.addClass(attr.mdFontIcon);

          lastFontIcon = attr.mdFontIcon;
        }

        var fontSet = $mdIcon.fontSet(attr.mdFontSet);

        if (lastFontSet !== fontSet) {
          element.removeClass(lastFontSet);
          element.addClass(fontSet);

          lastFontSet = fontSet;
        }
      }
    }
  }
}
