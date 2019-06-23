/**
 * Anchor scrolling
 * @module Anchor
 */

function scrollToAnchor(newpos) {
  TweenMax.to(window, 0.5, {scrollTo: {y: newpos, offsetY: 300}});
}


/**
 * инициализация событий якорного меню
 * @example
 * Anchor.init();
 */
function init(){
    
  $('.js-anchor').click(function(e){
    let id = $(this).attr('href');
    let scrollToID = $(id).find('.l-container').eq(0);
    if (!!$(this).closest('.modal').length) {
      Main.Modal.closeModal($(this).closest('.modal'));
    }
    if ($(scrollToID).length > 0) {
      e.preventDefault();
      let newpos = $(scrollToID).offset().top - 200;
      
      setTimeout(scrollToAnchor, 400, newpos);
      ;
      
      //if (window.history && window.history.pushState) {
      //  history.pushState("", document.title, id);
      //}
    }
  });
}

module.exports = {init};