/**
 * Helpers
 * @module Helpers
 */

// Add script asynh
function addScript (url) {
  var tag = document.createElement("script");
  tag.src = url;
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

(function() {

  // проверяем поддержку
  if (!Element.prototype.closest) {

    // реализуем
    Element.prototype.closest = function(css) {
      var node = this;

      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }

})();

(function() {

  // проверяем поддержку
  if (!Element.prototype.matches) {

    // определяем свойство
    Element.prototype.matches = Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;

  }

})();

/**
 * Calculate scrollbar width in element
 * - if the width is 0 it means the scrollbar is floated/overlayed
 * - accepts "container" paremeter because ie & edge can have different
 *   scrollbar behaviors for different elements using '-ms-overflow-style'
 */
function getNativeScrollbarWidth (container) {
  container = container || document.body;

  let fullWidth = 0;
  let barWidth = 0;

  let wrapper = document.createElement('div');
  let child = document.createElement('div');

  wrapper.style.position = 'absolute';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.bottom = '0';
  wrapper.style.right = '0';
  wrapper.style.width = '100px';
  wrapper.style.overflow = 'hidden';

  wrapper.appendChild(child);
  container.appendChild(wrapper);

  fullWidth = child.offsetWidth;
  wrapper.style.overflowY = 'scroll';
  barWidth = fullWidth - child.offsetWidth;

  container.removeChild(wrapper);

  return barWidth;
}

let timer;
let timeout = false;
let delta = 200;
function resizeEnd() {
  if (new Date() - timer < delta) {
    setTimeout(resizeEnd, delta);
  } else {
    timeout = false;
    $(window).trigger('resizeend');
  }
}

function toggleClassIf(el, cond, toggledClass){
	if(cond){
		el.addClass(toggledClass);
	} else {
		el.removeClass(toggledClass);
	}
}

/**
 * Функция добавляет к элементу класс, если страница прокручена больше, чем на указанное значение, 
 * и убирает класс, если значение меньше
 * @param {object} el - элемент, с которым взаимодействуем
 * @param {mixed} [scrollValue=0] - значение прокрутки, на котором меняем css-класс, ожидаемое значение - число или ключевое слово 'this'. Если передано 'this', подставляется положение el.offset().top минус половина высоты экрана
 * @param {string} [toggledClass=scrolled] - css-класс, который переключаем
 */
function toggleElementClassOnScroll(el, scrollValue = 0, toggledClass = 'scrolled'){
	if(el.length == 0) {
		//console.error("Необходимо передать объект, с которым вы хотите взаимодействовать");
		return false;
	}
	
	if(scrollValue == 'this') {
		scrollValue = el.offset().top - $(window).outerHeight() / 2;
	}
	
	$(window).on('scroll', function(e){
		if($(window).scrollTop() > scrollValue){
			el.addClass(toggledClass);
		} else {
			el.removeClass(toggledClass);
		}
	});
};

/* Modals */
function openModal(modal) {
  if (modal) {
    modal.fadeIn(500);
    $('html, body').css('overflow-y', 'hidden');
    modal.trigger('modalopened');
  } else {
    console.error('Which modal?');
  }
}

function closeModal(modal) {
  if (modal) {
    modal.fadeOut(500);
    $('html, body').css('overflow-y', '');
    modal.trigger('modalclosed')
  } else {
    console.error('Which modal?');
  }
}

function setScrollpad(els) {
  if ($('.layout').outerHeight() > window.outerHeight) {
    els.css({'padding-right': getNativeScrollbarWidth() + 'px'});
  } else {
    els.css({'padding-right': '0px'});
  }
}

/* Menu */
function showMenu() {
  $('.main-menu').addClass('is-open');
  $('.btn-menu').addClass('is-open');
  $('body').addClass('menu-is-open');
  if ($('.layout').outerHeight() > window.outerHeight) {
    $('.header').css({'right': getNativeScrollbarWidth() + 'px'});
    $('html, body').css('overflow-y', 'hidden');
  }
  $('.main-menu').fadeIn(500);
}
function hideMenu() {
  $('.main-menu').fadeOut(500);
  $('.main-menu').removeClass('is-open');
  $('.btn-menu').removeClass('is-open');
  $('body').removeClass('menu-is-open');
  if ($('.layout').outerHeight() > window.outerHeight) {
    $('.header').css({'right': '0px'});
    $('html, body').css('overflow-y', '');
  }
}


/**
 * инициализация событий для переключателей классов
 * @example
 * Helpers.init();
 */
function init(){
  
  toggleElementClassOnScroll($('.header'), 50);
  
  $('.js-toggle-block').on('click', function(){
    let target = $(this).data('target') === 'self' ? $(this).parent() : $($(this).data('target'));
    if (target.hasClass('off')) {
      target.removeClass('off').fadeIn(500);
    } else {
      target.addClass('off').fadeOut(500);
    }
  });

  $('.btn-close-popup').on('click', function(){
    let modal = !!$(this).data('target') ? $($(this).data('target')) : $(this).closest('.popup');
    closeModal(modal);
  });

  $('.btn-popup').on('click', function(e) {
    let target = $(this).data('target') === 'self' ? $(this).parent() : $($(this).data('target'));
    e.preventDefault();
    openModal(target);
  });

  
  $(window).on('resize', function () {
    timer = new Date();
    if (timeout === false) {
      timeout = true;
      setTimeout(resizeEnd, delta);
    }
  });

  /*
  setScrollpad($('.layout, .header'));

  $(window).on('resizeend', function(){
    setScrollpad($('.layout, .header'));
  });
  */
  
  $('.btn-menu').on('click', function(e){
    e.preventDefault();
    if ($('body').hasClass('menu-is-open')) {
      hideMenu();
    } else {
      showMenu();
    }
  });
  $('.btn-close-menu').on('click', function(e){
    e.preventDefault();
    hideMenu();
  });

  /*
  $(window).on('resizeend', function(){
    if (Main.DeviceDetection.isMobile()) {
      hideMenu();
    } else {
      showMenu();
    }
  });

  if (Main.DeviceDetection.isPortrait()) {
    $('html').addClass('rotated');
    $('.rotate').fadeIn(500);
  }

  $(window).on('resizeend', function(){
    if (Main.DeviceDetection.isPortrait()) {
      $('html').addClass('rotated');
      $('.rotate').fadeIn(500);
    } else {
      $('.rotate').fadeOut(500);
      $('html').removeClass('rotated');
    }
  });
  */

  $(window).scroll($.debounce(250, true, function() {
    $('html').addClass('is-scrolling');
  }));
  $(window).scroll($.debounce(250, function() {
    $('html').removeClass('is-scrolling');
  }));
  
}

module.exports = {
  init, 
  getNativeScrollbarWidth,
  toggleClassIf, 
  toggleElementClassOnScroll, 
  addScript, 
  openModal, 
  closeModal,
  showMenu,
  hideMenu
};