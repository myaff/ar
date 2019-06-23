/**
 * Карусель
 * @module Carousel
 */

let carouselDef, carouselSingle;

/**
 * Инициализация карусели
 */
function init(){
  carouselDef = $(".owl-carousel.carousel--default");
  carouselSingle = $(".owl-carousel.carousel--single");

  carouselDef.owlCarousel({
    autoWidth: true,
    margin: 10,
    nav: true,
    navText: ['<svg class="icon icon--stroked-3"><use xlink:href="#arr-prev"/></svg>', '<svg class="icon icon--stroked-3"><use xlink:href="#arr-next"/></svg>'],
    dots: false,
    loop: false,
    mouseDrag: false,
    animateOut: 'fadeOut'
  });

  carouselSingle.owlCarousel({
    items: 1,
    margin: 0,
    nav: true,
    navText: ['<svg class="icon icon--stroked-3"><use xlink:href="#arr-prev"/></svg>', '<svg class="icon icon--stroked-3"><use xlink:href="#arr-next"/></svg>'],
    dots: false,
    loop: true,
    mouseDrag: false,
    autoHeight: true,
    animateOut: 'fadeOut'
  });
}

module.exports = {init};