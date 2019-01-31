$(document).on('scroll', function() {
  if($(document).scrollTop()>96) {
    $('.ofd-header').addClass('-fix');
  } else {
    $('.ofd-header').removeClass('-fix');
  }
});

console.log('oi')
