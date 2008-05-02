// credits and such
;(function($) {
  $.fn.gels = function(opts) {
    opts = $.extend({parent:"auto"},opts||{});
    $(this).filter("[class^=gel]").each(function() {
      gelify(this);
    });
  };
  function gelify(el) {
    console.log(el)
  };
})(jQuery);