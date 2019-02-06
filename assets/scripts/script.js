import { confetti } from "dom-confetti";

$(document).on('scroll', function() {

  var sectionSolution = $('.section-solution');
  var headerOffset = sectionSolution.height()/2 + sectionSolution.offset().top;

  if($(document).scrollTop() > 64 && $(document).scrollTop() < headerOffset) {
    $('.ofd-header').addClass('-hide');
  } else {
    $('.ofd-header').removeClass('-hide');
  }

  if ($(document).scrollTop()>headerOffset) {
    $('.ofd-header').addClass('-fix');
  } else {
    $('.ofd-header').removeClass('-fix');
  }

});
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

$("#recipient").text(getUrlParameter("email"))

//  Variable to hold request
var request;

// Bind to the submit event of our form
$("#send-magic").submit(function (event) {

  // Prevent default posting of form - put here to work in case of errors
  event.preventDefault();

  // Abort any pending request
  if (request) {
    request.abort();
  }
  // setup some local variables
  var $form = $(this);

  // Let's select and cache all the fields
  var $inputs = $form.find("input, select, button, textarea");

  // Serialize the data in the form
  var serializedData = $form.serialize();

  // Let's disable the inputs for the duration of the Ajax request.
  // Note: we disable elements AFTER the form data has been serialized.
  // Disabled form elements will not be serialized.
  $inputs.prop("disabled", true);

  // Fire off the request to /form.php
  request = $.ajax({
    url: "https://server.onefinaldoc.com/send-magiclink",
    type: "post",
    data: serializedData,
    dataType: "json"
  });

  // Callback handler that will be called on success
  request.done(function (response, textStatus, jqXHR) {
    // Log a message to the console
    console.log("Hooray, it worked!");
    console.log(serializedData);
    window.location.href=`/check-your-email.html?${serializedData}`
    
  });

  // Callback handler that will be called on failure
  request.fail(function (jqXHR, textStatus, errorThrown) {
    // Log the error to the console
    console.error(
      "The following error occurred: " +
      textStatus, errorThrown
    );
  });

  // Callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {
    // Reenable the inputs
    $inputs.prop("disabled", false);
  });

});
