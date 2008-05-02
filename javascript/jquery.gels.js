// credits and such
;(function($) {
  $.fn.gels = function(opts) {
    opts = $.extend({parent:"auto"},opts||{});
    $(this).filter("[class^=gel]").each(function() {
      gelify(this);
    });
  };
  function gelify(el) {
    console.log(' ')
    console.log('start')
    console.log(el)
    var current = $(el).css("background-color");
    console.log(current);
    var parent = $(el).parents().each(function() {
      var p = $(this).css("background-color");
      if (p == "transparent") return;
      console.log(this);
      console.log('p:'+p);
    });
    // console.log(parent);
    // $(el).css({'background-color':'#afa'});
  };
  $.gel = function() {
    $("[class^=gel]").gels();
  }
})(jQuery);