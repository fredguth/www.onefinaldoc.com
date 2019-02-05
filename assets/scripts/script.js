$(document).on('scroll', function() {

  var sectionSolution = $('.section-solution');
  var headerOffset = sectionSolution.height()/2 + sectionSolution.offset().top;

  if($(document).scrollTop()>64&&$(document).scrollTop()<headerOffset) {
    $('.ofd-header').addClass('-hide');
  } else {
    $('.ofd-header').removeClass('-hide');
  }

  if ($(document).scrollTop()>headerOffset) {
    $('.ofd-header').addClass('-fix');
    console.log(headerOffset)
  } else {
    $('.ofd-header').removeClass('-fix');
    console.log(headerOffset)
  }

});
