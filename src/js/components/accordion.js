/**
 * инициализация событий для кастомного селекта
 * @example
 * Accordion.init();
 */

function init(){

  $('.accordion__panel').on('click', function(){
    $(this).closest('.accordion').siblings('.accordion').removeClass('active');
    $(this).closest('.accordion').siblings('.accordion').find('.accordion__content').slideUp(500);
    $(this).closest('.accordion').toggleClass('active');
    $(this).siblings('.accordion__content').slideToggle(500);
  })
}

module.exports = {init};