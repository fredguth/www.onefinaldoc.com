$(document).on('scroll', function() {

  if($(document).scrollTop()>64&&$(document).scrollTop()<128) {
    $('.ofd-header').addClass('-hide');
  } else {
    $('.ofd-header').removeClass('-hide');
  }

  if ($(document).scrollTop()>128) {
    $('.ofd-header').addClass('-fix');
  } else {
    $('.ofd-header').removeClass('-fix');
  }

});
