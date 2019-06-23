/**
 * Statistic
 * @module Statistic
 */

function sendGa(category, action, label) {
  ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label
  });
};

function init() {
  $('.btn-ticket').on('click', function() {
    sendGa('external', 'click', 'buy_ticket');
  });
  $('.link-lenta').on('click', function(){
    sendGa('external', 'click', 'lenta_logo');
  });

  $('#trailer').on('modalopen', function() {
    sendGa('internal', 'click', 'watch_trailer');
  });
  $('#trailer').on('modalclosed', function() {
    sendGa('internal', 'click', 'close_trailer');
  });
  $('.btn-material').on('click', function() {
    sendGa('internal', 'click', $(this).closest('.screen').data('material'));
  });
  $('.fp-section').on('sectionscrolled', function(e, label) {
    sendGa('internal', 'scroll', label);
  })

  if($('.layout').hasClass('layout--lenta')) {
    jQuery.scrollDepth();
  }

}

module.exports = { init, sendGa };