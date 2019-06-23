/**
 * Переключение классов по различным событиям
 * @module Animation
 */

let welcome = $('.js-welcome');

function clearStyle (el) {
  $(el).css({"transform": ""});
}

function welcomeAnimation () {
  setTimeout(function(){
    welcome.addClass('start');
  }, 100);
  setTimeout(function(){
    welcome.addClass('end');
    welcome.trigger('animend');
  }, 2000);
  setTimeout(function(){
    welcome.trigger('animdone');
  }, 3000);
}

function init () {

  welcomeAnimation();

  welcome.on('animend', function() {
    $('body').addClass('welcome-end');
  });
  welcome.on('animdone', function() {
    $('body').addClass('welcome-done');
  });

  $('.fullpage').fullpage({
    navigation: true,
    navigationPosition: 'left',
    onLeave: function (origin, destination, direction) {
      if (destination !== 1) {
        let label = 'material_' + (destination - 1);
        this.trigger('sectionscrolled', label);
      }
    }
  });
}

module.exports = {init};