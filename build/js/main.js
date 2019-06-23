var Main =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/kenzo/build/js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var DeviceDetection = __webpack_require__(1);
	var Helpers = __webpack_require__(2);
	var Animation = __webpack_require__(3);
	var Loader = __webpack_require__(4);

	$(document).ready(function () {

	  Loader.init();

	  DeviceDetection.run();
	  Helpers.init();

	  $.afterlag(function () {
	    $('html').addClass('is-loaded');
	  });

	  $('html').addClass('is-animating');

	  //Animation.init();

	});

	/**
	 * Список экспортируемых модулей, чтобы иметь к ним доступ извне
	 * @example
	 * Main.Form.isFormValid();
	 */
	module.exports = {
	  DeviceDetection: DeviceDetection,
	  Helpers: Helpers,
	  Animation: Animation,
	  Loader: Loader
		};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var breakpoints = {
	  sm: 767,
	  md: 1024,
	  lg: 1280,
	  xl: 1600
	};

	function isPortrait() {
	  return $(window).width() < $(window).height();
	}
	function isLandscape() {
	  return $(window).width() > $(window).height();
	}
	function isMobile() {
	  return $(window).width() <= breakpoints.sm;
	}
	function isTablet() {
	  return $(window).width() > breakpoints.sm && $(window).width() <= breakpoints.md;
	}
	function isDesktopExt() {
	  return $(window).width() >= breakpoints.md;
	}
	function isDesktop() {
	  return $(window).width() > breakpoints.md;
	}
	function isTouch() {
	  return 'ontouchstart' in window || navigator.maxTouchPoints;
	}
	function isMobileVersion() {
	  return !!~window.location.href.indexOf("/mobile/");
	}

	function run() {
	  if (isTouch()) {
	    $('html').removeClass('no-touch').addClass('touch');
	  } else {
	    $('html').removeClass('touch').addClass('no-touch');
	  }
	}

	module.exports = {
	  run: run,
	  isTouch: isTouch,
	  isMobile: isMobile,
	  isTablet: isTablet,
	  isDesktop: isDesktop,
	  isDesktopExt: isDesktopExt,
	  isMobileVersion: isMobileVersion,
	  isPortrait: isPortrait,
	  isLandscape: isLandscape
		};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Helpers
	 * @module Helpers
	 */

	// Add script asynh
	function addScript(url) {
	  var tag = document.createElement("script");
	  tag.src = url;
	  var firstScriptTag = document.getElementsByTagName("script")[0];
	  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}

	(function () {

	  // проверяем поддержку
	  if (!Element.prototype.closest) {

	    // реализуем
	    Element.prototype.closest = function (css) {
	      var node = this;

	      while (node) {
	        if (node.matches(css)) return node;else node = node.parentElement;
	      }
	      return null;
	    };
	  }
	})();

	(function () {

	  // проверяем поддержку
	  if (!Element.prototype.matches) {

	    // определяем свойство
	    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
	  }
	})();

	/**
	 * Calculate scrollbar width in element
	 * - if the width is 0 it means the scrollbar is floated/overlayed
	 * - accepts "container" paremeter because ie & edge can have different
	 *   scrollbar behaviors for different elements using '-ms-overflow-style'
	 */
	function getNativeScrollbarWidth(container) {
	  container = container || document.body;

	  var fullWidth = 0;
	  var barWidth = 0;

	  var wrapper = document.createElement('div');
	  var child = document.createElement('div');

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

	var timer = void 0;
	var timeout = false;
	var delta = 200;
	function resizeEnd() {
	  if (new Date() - timer < delta) {
	    setTimeout(resizeEnd, delta);
	  } else {
	    timeout = false;
	    $(window).trigger('resizeend');
	  }
	}

	function toggleClassIf(el, cond, toggledClass) {
	  if (cond) {
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
	function toggleElementClassOnScroll(el) {
	  var scrollValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	  var toggledClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'scrolled';

	  if (el.length == 0) {
	    //console.error("Необходимо передать объект, с которым вы хотите взаимодействовать");
	    return false;
	  }

	  if (scrollValue == 'this') {
	    scrollValue = el.offset().top - $(window).outerHeight() / 2;
	  }

	  $(window).on('scroll', function (e) {
	    if ($(window).scrollTop() > scrollValue) {
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
	    modal.trigger('modalclosed');
	  } else {
	    console.error('Which modal?');
	  }
	}

	function setScrollpad(els) {
	  if ($('.layout').outerHeight() > window.outerHeight) {
	    els.css({ 'padding-right': getNativeScrollbarWidth() + 'px' });
	  } else {
	    els.css({ 'padding-right': '0px' });
	  }
	}

	/* Menu */
	function showMenu() {
	  $('.main-menu').addClass('is-open');
	  $('.btn-menu').addClass('is-open');
	  $('body').addClass('menu-is-open');
	  if ($('.layout').outerHeight() > window.outerHeight) {
	    $('.header').css({ 'right': getNativeScrollbarWidth() + 'px' });
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
	    $('.header').css({ 'right': '0px' });
	    $('html, body').css('overflow-y', '');
	  }
	}

	/**
	 * инициализация событий для переключателей классов
	 * @example
	 * Helpers.init();
	 */
	function init() {

	  toggleElementClassOnScroll($('.header'), 50);

	  $('.js-toggle-block').on('click', function () {
	    var target = $(this).data('target') === 'self' ? $(this).parent() : $($(this).data('target'));
	    if (target.hasClass('off')) {
	      target.removeClass('off').fadeIn(500);
	    } else {
	      target.addClass('off').fadeOut(500);
	    }
	  });

	  $('.btn-close-popup').on('click', function () {
	    var modal = !!$(this).data('target') ? $($(this).data('target')) : $(this).closest('.popup');
	    closeModal(modal);
	  });

	  $('.btn-popup').on('click', function (e) {
	    var target = $(this).data('target') === 'self' ? $(this).parent() : $($(this).data('target'));
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

	  $('.btn-menu').on('click', function (e) {
	    e.preventDefault();
	    if ($('body').hasClass('menu-is-open')) {
	      hideMenu();
	    } else {
	      showMenu();
	    }
	  });
	  $('.btn-close-menu').on('click', function (e) {
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

	  $(window).scroll($.debounce(250, true, function () {
	    $('html').addClass('is-scrolling');
	  }));
	  $(window).scroll($.debounce(250, function () {
	    $('html').removeClass('is-scrolling');
	  }));
	}

	module.exports = {
	  init: init,
	  getNativeScrollbarWidth: getNativeScrollbarWidth,
	  toggleClassIf: toggleClassIf,
	  toggleElementClassOnScroll: toggleElementClassOnScroll,
	  addScript: addScript,
	  openModal: openModal,
	  closeModal: closeModal,
	  showMenu: showMenu,
	  hideMenu: hideMenu
		};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Переключение классов по различным событиям
	 * @module Animation
	 */

	var welcome = $('.js-welcome');

	function clearStyle(el) {
	  $(el).css({ "transform": "" });
	}

	function welcomeAnimation() {
	  setTimeout(function () {
	    welcome.addClass('start');
	  }, 100);
	  setTimeout(function () {
	    welcome.addClass('end');
	    welcome.trigger('animend');
	  }, 2000);
	  setTimeout(function () {
	    welcome.trigger('animdone');
	  }, 3000);
	}

	function init() {

	  welcomeAnimation();

	  welcome.on('animend', function () {
	    $('body').addClass('welcome-end');
	  });
	  welcome.on('animdone', function () {
	    $('body').addClass('welcome-done');
	  });

	  $('.fullpage').fullpage({
	    navigation: true,
	    navigationPosition: 'left',
	    onLeave: function onLeave(origin, destination, direction) {
	      if (destination !== 1) {
	        var label = 'material_' + (destination - 1);
	        this.trigger('sectionscrolled', label);
	      }
	    }
	  });
	}

	module.exports = { init: init };

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	/* Loader */

	var line = $('.loader .line');
	var perc = $('.loader .percentage');
	var progress = 0;

	function a(progress) {
	  line.animate({ width: progress + '%' }, 100, function () {
	    perc.text(progress + '%');
	  });
	}

	function init() {

	  var timerId = setTimeout(function tick() {
	    if (progress <= 100) {
	      a(progress);
	      progress++;
	      timerId = setTimeout(tick, 100);
	    }
	  }, 100);
	}

	module.exports = { init: init };

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxYTdmNTliN2YzMmIwOWUzZjU1OCIsIndlYnBhY2s6Ly8vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2FuaW1hdGlvbi5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvbG9hZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9rZW56by9idWlsZC9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxYTdmNTliN2YzMmIwOWUzZjU1OCIsImxldCBEZXZpY2VEZXRlY3Rpb24gPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb25cIik7XHJcbmxldCBIZWxwZXJzID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9oZWxwZXJzXCIpO1xyXG5sZXQgQW5pbWF0aW9uID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9hbmltYXRpb25cIik7XHJcbmxldCBMb2FkZXIgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2xvYWRlclwiKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblxyXG4gIExvYWRlci5pbml0KCk7XHJcbiAgXHJcbiAgRGV2aWNlRGV0ZWN0aW9uLnJ1bigpO1xyXG4gIEhlbHBlcnMuaW5pdCgpO1xyXG4gIFxyXG4gICQuYWZ0ZXJsYWcoZnVuY3Rpb24oKXtcclxuICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtbG9hZGVkJyk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuICBcclxuICAvL0FuaW1hdGlvbi5pbml0KCk7XHJcblxyXG4gIFxyXG59KTtcclxuXHJcblxyXG4vKipcclxuICog0KHQv9C40YHQvtC6INGN0LrRgdC/0L7RgNGC0LjRgNGD0LXQvNGL0YUg0LzQvtC00YPQu9C10LksINGH0YLQvtCx0Ysg0LjQvNC10YLRjCDQuiDQvdC40Lwg0LTQvtGB0YLRg9C/INC40LfQstC90LVcclxuICogQGV4YW1wbGVcclxuICogTWFpbi5Gb3JtLmlzRm9ybVZhbGlkKCk7XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBEZXZpY2VEZXRlY3Rpb24sXHJcbiAgSGVscGVycyxcclxuICBBbmltYXRpb24sXHJcbiAgTG9hZGVyLFxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvbWFpbi5qcyIsImxldCBicmVha3BvaW50cyA9IHtcclxuICBzbTogNzY3LFxyXG4gIG1kOiAxMDI0LFxyXG4gIGxnOiAxMjgwLFxyXG4gIHhsOiAxNjAwXHJcbn07XHJcblxyXG5mdW5jdGlvbiBpc1BvcnRyYWl0KCkge1xyXG4gIHJldHVybiAoJCh3aW5kb3cpLndpZHRoKCkgPCAkKHdpbmRvdykuaGVpZ2h0KCkpO1xyXG59XHJcbmZ1bmN0aW9uIGlzTGFuZHNjYXBlKCkge1xyXG4gIHJldHVybiAoJCh3aW5kb3cpLndpZHRoKCkgPiAkKHdpbmRvdykuaGVpZ2h0KCkpO1xyXG59XHJcbmZ1bmN0aW9uIGlzTW9iaWxlKCl7XHJcbiAgcmV0dXJuICgkKHdpbmRvdykud2lkdGgoKSA8PSBicmVha3BvaW50cy5zbSk7XHJcbn1cclxuZnVuY3Rpb24gaXNUYWJsZXQoKXtcclxuICByZXR1cm4gKCQod2luZG93KS53aWR0aCgpID4gYnJlYWtwb2ludHMuc20gJiYgJCh3aW5kb3cpLndpZHRoKCkgPD0gYnJlYWtwb2ludHMubWQpXHJcbn1cclxuZnVuY3Rpb24gaXNEZXNrdG9wRXh0KCl7XHJcbiAgcmV0dXJuICgkKHdpbmRvdykud2lkdGgoKSA+PSBicmVha3BvaW50cy5tZClcclxufVxyXG5mdW5jdGlvbiBpc0Rlc2t0b3AoKXtcclxuICByZXR1cm4gKCQod2luZG93KS53aWR0aCgpID4gYnJlYWtwb2ludHMubWQpXHJcbn1cclxuZnVuY3Rpb24gaXNUb3VjaCgpe1xyXG4gIHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzO1xyXG59XHJcbmZ1bmN0aW9uIGlzTW9iaWxlVmVyc2lvbigpe1xyXG4gIHJldHVybiAhIX53aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwiL21vYmlsZS9cIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJ1bigpe1xyXG4gIGlmKGlzVG91Y2goKSl7XHJcbiAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ25vLXRvdWNoJykuYWRkQ2xhc3MoJ3RvdWNoJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygndG91Y2gnKS5hZGRDbGFzcygnbm8tdG91Y2gnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHJ1bixcclxuICBpc1RvdWNoLFxyXG4gIGlzTW9iaWxlLFxyXG4gIGlzVGFibGV0LFxyXG4gIGlzRGVza3RvcCxcclxuICBpc0Rlc2t0b3BFeHQsXHJcbiAgaXNNb2JpbGVWZXJzaW9uLFxyXG4gIGlzUG9ydHJhaXQsXHJcbiAgaXNMYW5kc2NhcGVcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL2NvbXBvbmVudHMvZGV2aWNlLWRldGVjdGlvbi5qcyIsIi8qKlxyXG4gKiBIZWxwZXJzXHJcbiAqIEBtb2R1bGUgSGVscGVyc1xyXG4gKi9cclxuXHJcbi8vIEFkZCBzY3JpcHQgYXN5bmhcclxuZnVuY3Rpb24gYWRkU2NyaXB0ICh1cmwpIHtcclxuICB2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICB0YWcuc3JjID0gdXJsO1xyXG4gIHZhciBmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpWzBdO1xyXG4gIGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRhZywgZmlyc3RTY3JpcHRUYWcpO1xyXG59XHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcblxyXG4gIC8vINC/0YDQvtCy0LXRgNGP0LXQvCDQv9C+0LTQtNC10YDQttC60YNcclxuICBpZiAoIUVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QpIHtcclxuXHJcbiAgICAvLyDRgNC10LDQu9C40LfRg9C10LxcclxuICAgIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgPSBmdW5jdGlvbihjc3MpIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzO1xyXG5cclxuICAgICAgd2hpbGUgKG5vZGUpIHtcclxuICAgICAgICBpZiAobm9kZS5tYXRjaGVzKGNzcykpIHJldHVybiBub2RlO1xyXG4gICAgICAgIGVsc2Ugbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxufSkoKTtcclxuXHJcbihmdW5jdGlvbigpIHtcclxuXHJcbiAgLy8g0L/RgNC+0LLQtdGA0Y/QtdC8INC/0L7QtNC00LXRgNC20LrRg1xyXG4gIGlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xyXG5cclxuICAgIC8vINC+0L/RgNC10LTQtdC70Y/QtdC8INGB0LLQvtC50YHRgtCy0L5cclxuICAgIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPSBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzU2VsZWN0b3IgfHxcclxuICAgICAgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICAgIEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgICBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbiAgfVxyXG5cclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGUgc2Nyb2xsYmFyIHdpZHRoIGluIGVsZW1lbnRcclxuICogLSBpZiB0aGUgd2lkdGggaXMgMCBpdCBtZWFucyB0aGUgc2Nyb2xsYmFyIGlzIGZsb2F0ZWQvb3ZlcmxheWVkXHJcbiAqIC0gYWNjZXB0cyBcImNvbnRhaW5lclwiIHBhcmVtZXRlciBiZWNhdXNlIGllICYgZWRnZSBjYW4gaGF2ZSBkaWZmZXJlbnRcclxuICogICBzY3JvbGxiYXIgYmVoYXZpb3JzIGZvciBkaWZmZXJlbnQgZWxlbWVudHMgdXNpbmcgJy1tcy1vdmVyZmxvdy1zdHlsZSdcclxuICovXHJcbmZ1bmN0aW9uIGdldE5hdGl2ZVNjcm9sbGJhcldpZHRoIChjb250YWluZXIpIHtcclxuICBjb250YWluZXIgPSBjb250YWluZXIgfHwgZG9jdW1lbnQuYm9keTtcclxuXHJcbiAgbGV0IGZ1bGxXaWR0aCA9IDA7XHJcbiAgbGV0IGJhcldpZHRoID0gMDtcclxuXHJcbiAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBsZXQgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbiAgd3JhcHBlci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgd3JhcHBlci5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gIHdyYXBwZXIuc3R5bGUuYm90dG9tID0gJzAnO1xyXG4gIHdyYXBwZXIuc3R5bGUucmlnaHQgPSAnMCc7XHJcbiAgd3JhcHBlci5zdHlsZS53aWR0aCA9ICcxMDBweCc7XHJcbiAgd3JhcHBlci5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cclxuICB3cmFwcGVyLmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcblxyXG4gIGZ1bGxXaWR0aCA9IGNoaWxkLm9mZnNldFdpZHRoO1xyXG4gIHdyYXBwZXIuc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XHJcbiAgYmFyV2lkdGggPSBmdWxsV2lkdGggLSBjaGlsZC5vZmZzZXRXaWR0aDtcclxuXHJcbiAgY29udGFpbmVyLnJlbW92ZUNoaWxkKHdyYXBwZXIpO1xyXG5cclxuICByZXR1cm4gYmFyV2lkdGg7XHJcbn1cclxuXHJcbmxldCB0aW1lcjtcclxubGV0IHRpbWVvdXQgPSBmYWxzZTtcclxubGV0IGRlbHRhID0gMjAwO1xyXG5mdW5jdGlvbiByZXNpemVFbmQoKSB7XHJcbiAgaWYgKG5ldyBEYXRlKCkgLSB0aW1lciA8IGRlbHRhKSB7XHJcbiAgICBzZXRUaW1lb3V0KHJlc2l6ZUVuZCwgZGVsdGEpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aW1lb3V0ID0gZmFsc2U7XHJcbiAgICAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplZW5kJyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVDbGFzc0lmKGVsLCBjb25kLCB0b2dnbGVkQ2xhc3Mpe1xyXG5cdGlmKGNvbmQpe1xyXG5cdFx0ZWwuYWRkQ2xhc3ModG9nZ2xlZENsYXNzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0ZWwucmVtb3ZlQ2xhc3ModG9nZ2xlZENsYXNzKTtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNGD0L3QutGG0LjRjyDQtNC+0LHQsNCy0LvRj9C10YIg0Log0Y3Qu9C10LzQtdC90YLRgyDQutC70LDRgdGBLCDQtdGB0LvQuCDRgdGC0YDQsNC90LjRhtCwINC/0YDQvtC60YDRg9GH0LXQvdCwINCx0L7Qu9GM0YjQtSwg0YfQtdC8INC90LAg0YPQutCw0LfQsNC90L3QvtC1INC30L3QsNGH0LXQvdC40LUsIFxyXG4gKiDQuCDRg9Cx0LjRgNCw0LXRgiDQutC70LDRgdGBLCDQtdGB0LvQuCDQt9C90LDRh9C10L3QuNC1INC80LXQvdGM0YjQtVxyXG4gKiBAcGFyYW0ge29iamVjdH0gZWwgLSDRjdC70LXQvNC10L3Rgiwg0YEg0LrQvtGC0L7RgNGL0Lwg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0YPQtdC8XHJcbiAqIEBwYXJhbSB7bWl4ZWR9IFtzY3JvbGxWYWx1ZT0wXSAtINC30L3QsNGH0LXQvdC40LUg0L/RgNC+0LrRgNGD0YLQutC4LCDQvdCwINC60L7RgtC+0YDQvtC8INC80LXQvdGP0LXQvCBjc3Mt0LrQu9Cw0YHRgSwg0L7QttC40LTQsNC10LzQvtC1INC30L3QsNGH0LXQvdC40LUgLSDRh9C40YHQu9C+INC40LvQuCDQutC70Y7Rh9C10LLQvtC1INGB0LvQvtCy0L4gJ3RoaXMnLiDQldGB0LvQuCDQv9C10YDQtdC00LDQvdC+ICd0aGlzJywg0L/QvtC00YHRgtCw0LLQu9GP0LXRgtGB0Y8g0L/QvtC70L7QttC10L3QuNC1IGVsLm9mZnNldCgpLnRvcCDQvNC40L3Rg9GBINC/0L7Qu9C+0LLQuNC90LAg0LLRi9GB0L7RgtGLINGN0LrRgNCw0L3QsFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3RvZ2dsZWRDbGFzcz1zY3JvbGxlZF0gLSBjc3Mt0LrQu9Cw0YHRgSwg0LrQvtGC0L7RgNGL0Lkg0L/QtdGA0LXQutC70Y7Rh9Cw0LXQvFxyXG4gKi9cclxuZnVuY3Rpb24gdG9nZ2xlRWxlbWVudENsYXNzT25TY3JvbGwoZWwsIHNjcm9sbFZhbHVlID0gMCwgdG9nZ2xlZENsYXNzID0gJ3Njcm9sbGVkJyl7XHJcblx0aWYoZWwubGVuZ3RoID09IDApIHtcclxuXHRcdC8vY29uc29sZS5lcnJvcihcItCd0LXQvtCx0YXQvtC00LjQvNC+INC/0LXRgNC10LTQsNGC0Ywg0L7QsdGK0LXQutGCLCDRgSDQutC+0YLQvtGA0YvQvCDQstGLINGF0L7RgtC40YLQtSDQstC30LDQuNC80L7QtNC10LnRgdGC0LLQvtCy0LDRgtGMXCIpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHRcclxuXHRpZihzY3JvbGxWYWx1ZSA9PSAndGhpcycpIHtcclxuXHRcdHNjcm9sbFZhbHVlID0gZWwub2Zmc2V0KCkudG9wIC0gJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLyAyO1xyXG5cdH1cclxuXHRcclxuXHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gc2Nyb2xsVmFsdWUpe1xyXG5cdFx0XHRlbC5hZGRDbGFzcyh0b2dnbGVkQ2xhc3MpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZWwucmVtb3ZlQ2xhc3ModG9nZ2xlZENsYXNzKTtcclxuXHRcdH1cclxuXHR9KTtcclxufTtcclxuXHJcbi8qIE1vZGFscyAqL1xyXG5mdW5jdGlvbiBvcGVuTW9kYWwobW9kYWwpIHtcclxuICBpZiAobW9kYWwpIHtcclxuICAgIG1vZGFsLmZhZGVJbig1MDApO1xyXG4gICAgJCgnaHRtbCwgYm9keScpLmNzcygnb3ZlcmZsb3cteScsICdoaWRkZW4nKTtcclxuICAgIG1vZGFsLnRyaWdnZXIoJ21vZGFsb3BlbmVkJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1doaWNoIG1vZGFsPycpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNb2RhbChtb2RhbCkge1xyXG4gIGlmIChtb2RhbCkge1xyXG4gICAgbW9kYWwuZmFkZU91dCg1MDApO1xyXG4gICAgJCgnaHRtbCwgYm9keScpLmNzcygnb3ZlcmZsb3cteScsICcnKTtcclxuICAgIG1vZGFsLnRyaWdnZXIoJ21vZGFsY2xvc2VkJylcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc29sZS5lcnJvcignV2hpY2ggbW9kYWw/Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRTY3JvbGxwYWQoZWxzKSB7XHJcbiAgaWYgKCQoJy5sYXlvdXQnKS5vdXRlckhlaWdodCgpID4gd2luZG93Lm91dGVySGVpZ2h0KSB7XHJcbiAgICBlbHMuY3NzKHsncGFkZGluZy1yaWdodCc6IGdldE5hdGl2ZVNjcm9sbGJhcldpZHRoKCkgKyAncHgnfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGVscy5jc3MoeydwYWRkaW5nLXJpZ2h0JzogJzBweCd9KTtcclxuICB9XHJcbn1cclxuXHJcbi8qIE1lbnUgKi9cclxuZnVuY3Rpb24gc2hvd01lbnUoKSB7XHJcbiAgJCgnLm1haW4tbWVudScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XHJcbiAgJCgnLmJ0bi1tZW51JykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAkKCdib2R5JykuYWRkQ2xhc3MoJ21lbnUtaXMtb3BlbicpO1xyXG4gIGlmICgkKCcubGF5b3V0Jykub3V0ZXJIZWlnaHQoKSA+IHdpbmRvdy5vdXRlckhlaWdodCkge1xyXG4gICAgJCgnLmhlYWRlcicpLmNzcyh7J3JpZ2h0JzogZ2V0TmF0aXZlU2Nyb2xsYmFyV2lkdGgoKSArICdweCd9KTtcclxuICAgICQoJ2h0bWwsIGJvZHknKS5jc3MoJ292ZXJmbG93LXknLCAnaGlkZGVuJyk7XHJcbiAgfVxyXG4gICQoJy5tYWluLW1lbnUnKS5mYWRlSW4oNTAwKTtcclxufVxyXG5mdW5jdGlvbiBoaWRlTWVudSgpIHtcclxuICAkKCcubWFpbi1tZW51JykuZmFkZU91dCg1MDApO1xyXG4gICQoJy5tYWluLW1lbnUnKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xyXG4gICQoJy5idG4tbWVudScpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XHJcbiAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtZW51LWlzLW9wZW4nKTtcclxuICBpZiAoJCgnLmxheW91dCcpLm91dGVySGVpZ2h0KCkgPiB3aW5kb3cub3V0ZXJIZWlnaHQpIHtcclxuICAgICQoJy5oZWFkZXInKS5jc3MoeydyaWdodCc6ICcwcHgnfSk7XHJcbiAgICAkKCdodG1sLCBib2R5JykuY3NzKCdvdmVyZmxvdy15JywgJycpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0LHRi9GC0LjQuSDQtNC70Y8g0L/QtdGA0LXQutC70Y7Rh9Cw0YLQtdC70LXQuSDQutC70LDRgdGB0L7QslxyXG4gKiBAZXhhbXBsZVxyXG4gKiBIZWxwZXJzLmluaXQoKTtcclxuICovXHJcbmZ1bmN0aW9uIGluaXQoKXtcclxuICBcclxuICB0b2dnbGVFbGVtZW50Q2xhc3NPblNjcm9sbCgkKCcuaGVhZGVyJyksIDUwKTtcclxuICBcclxuICAkKCcuanMtdG9nZ2xlLWJsb2NrJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgIGxldCB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoJ3RhcmdldCcpID09PSAnc2VsZicgPyAkKHRoaXMpLnBhcmVudCgpIDogJCgkKHRoaXMpLmRhdGEoJ3RhcmdldCcpKTtcclxuICAgIGlmICh0YXJnZXQuaGFzQ2xhc3MoJ29mZicpKSB7XHJcbiAgICAgIHRhcmdldC5yZW1vdmVDbGFzcygnb2ZmJykuZmFkZUluKDUwMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0YXJnZXQuYWRkQ2xhc3MoJ29mZicpLmZhZGVPdXQoNTAwKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnLmJ0bi1jbG9zZS1wb3B1cCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgbW9kYWwgPSAhISQodGhpcykuZGF0YSgndGFyZ2V0JykgPyAkKCQodGhpcykuZGF0YSgndGFyZ2V0JykpIDogJCh0aGlzKS5jbG9zZXN0KCcucG9wdXAnKTtcclxuICAgIGNsb3NlTW9kYWwobW9kYWwpO1xyXG4gIH0pO1xyXG5cclxuICAkKCcuYnRuLXBvcHVwJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgbGV0IHRhcmdldCA9ICQodGhpcykuZGF0YSgndGFyZ2V0JykgPT09ICdzZWxmJyA/ICQodGhpcykucGFyZW50KCkgOiAkKCQodGhpcykuZGF0YSgndGFyZ2V0JykpO1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgb3Blbk1vZGFsKHRhcmdldCk7XHJcbiAgfSk7XHJcblxyXG4gIFxyXG4gICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgdGltZXIgPSBuZXcgRGF0ZSgpO1xyXG4gICAgaWYgKHRpbWVvdXQgPT09IGZhbHNlKSB7XHJcbiAgICAgIHRpbWVvdXQgPSB0cnVlO1xyXG4gICAgICBzZXRUaW1lb3V0KHJlc2l6ZUVuZCwgZGVsdGEpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvKlxyXG4gIHNldFNjcm9sbHBhZCgkKCcubGF5b3V0LCAuaGVhZGVyJykpO1xyXG5cclxuICAkKHdpbmRvdykub24oJ3Jlc2l6ZWVuZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBzZXRTY3JvbGxwYWQoJCgnLmxheW91dCwgLmhlYWRlcicpKTtcclxuICB9KTtcclxuICAqL1xyXG4gIFxyXG4gICQoJy5idG4tbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygnbWVudS1pcy1vcGVuJykpIHtcclxuICAgICAgaGlkZU1lbnUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNob3dNZW51KCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgJCgnLmJ0bi1jbG9zZS1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBoaWRlTWVudSgpO1xyXG4gIH0pO1xyXG5cclxuICAvKlxyXG4gICQod2luZG93KS5vbigncmVzaXplZW5kJywgZnVuY3Rpb24oKXtcclxuICAgIGlmIChNYWluLkRldmljZURldGVjdGlvbi5pc01vYmlsZSgpKSB7XHJcbiAgICAgIGhpZGVNZW51KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzaG93TWVudSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBpZiAoTWFpbi5EZXZpY2VEZXRlY3Rpb24uaXNQb3J0cmFpdCgpKSB7XHJcbiAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ3JvdGF0ZWQnKTtcclxuICAgICQoJy5yb3RhdGUnKS5mYWRlSW4oNTAwKTtcclxuICB9XHJcblxyXG4gICQod2luZG93KS5vbigncmVzaXplZW5kJywgZnVuY3Rpb24oKXtcclxuICAgIGlmIChNYWluLkRldmljZURldGVjdGlvbi5pc1BvcnRyYWl0KCkpIHtcclxuICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdyb3RhdGVkJyk7XHJcbiAgICAgICQoJy5yb3RhdGUnKS5mYWRlSW4oNTAwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJy5yb3RhdGUnKS5mYWRlT3V0KDUwMCk7XHJcbiAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygncm90YXRlZCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gICovXHJcblxyXG4gICQod2luZG93KS5zY3JvbGwoJC5kZWJvdW5jZSgyNTAsIHRydWUsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1zY3JvbGxpbmcnKTtcclxuICB9KSk7XHJcbiAgJCh3aW5kb3cpLnNjcm9sbCgkLmRlYm91bmNlKDI1MCwgZnVuY3Rpb24oKSB7XHJcbiAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2lzLXNjcm9sbGluZycpO1xyXG4gIH0pKTtcclxuICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgaW5pdCwgXHJcbiAgZ2V0TmF0aXZlU2Nyb2xsYmFyV2lkdGgsXHJcbiAgdG9nZ2xlQ2xhc3NJZiwgXHJcbiAgdG9nZ2xlRWxlbWVudENsYXNzT25TY3JvbGwsIFxyXG4gIGFkZFNjcmlwdCwgXHJcbiAgb3Blbk1vZGFsLCBcclxuICBjbG9zZU1vZGFsLFxyXG4gIHNob3dNZW51LFxyXG4gIGhpZGVNZW51XHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2hlbHBlcnMuanMiLCIvKipcclxuICog0J/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INC60LvQsNGB0YHQvtCyINC/0L4g0YDQsNC30LvQuNGH0L3Ri9C8INGB0L7QsdGL0YLQuNGP0LxcclxuICogQG1vZHVsZSBBbmltYXRpb25cclxuICovXHJcblxyXG5sZXQgd2VsY29tZSA9ICQoJy5qcy13ZWxjb21lJyk7XHJcblxyXG5mdW5jdGlvbiBjbGVhclN0eWxlIChlbCkge1xyXG4gICQoZWwpLmNzcyh7XCJ0cmFuc2Zvcm1cIjogXCJcIn0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3ZWxjb21lQW5pbWF0aW9uICgpIHtcclxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICB3ZWxjb21lLmFkZENsYXNzKCdzdGFydCcpO1xyXG4gIH0sIDEwMCk7XHJcbiAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgd2VsY29tZS5hZGRDbGFzcygnZW5kJyk7XHJcbiAgICB3ZWxjb21lLnRyaWdnZXIoJ2FuaW1lbmQnKTtcclxuICB9LCAyMDAwKTtcclxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICB3ZWxjb21lLnRyaWdnZXIoJ2FuaW1kb25lJyk7XHJcbiAgfSwgMzAwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQgKCkge1xyXG5cclxuICB3ZWxjb21lQW5pbWF0aW9uKCk7XHJcblxyXG4gIHdlbGNvbWUub24oJ2FuaW1lbmQnLCBmdW5jdGlvbigpIHtcclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcygnd2VsY29tZS1lbmQnKTtcclxuICB9KTtcclxuICB3ZWxjb21lLm9uKCdhbmltZG9uZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKCd3ZWxjb21lLWRvbmUnKTtcclxuICB9KTtcclxuXHJcbiAgJCgnLmZ1bGxwYWdlJykuZnVsbHBhZ2Uoe1xyXG4gICAgbmF2aWdhdGlvbjogdHJ1ZSxcclxuICAgIG5hdmlnYXRpb25Qb3NpdGlvbjogJ2xlZnQnLFxyXG4gICAgb25MZWF2ZTogZnVuY3Rpb24gKG9yaWdpbiwgZGVzdGluYXRpb24sIGRpcmVjdGlvbikge1xyXG4gICAgICBpZiAoZGVzdGluYXRpb24gIT09IDEpIHtcclxuICAgICAgICBsZXQgbGFiZWwgPSAnbWF0ZXJpYWxfJyArIChkZXN0aW5hdGlvbiAtIDEpO1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcignc2VjdGlvbnNjcm9sbGVkJywgbGFiZWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2luaXR9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9hbmltYXRpb24uanMiLCIvKiBMb2FkZXIgKi9cblxubGV0IGxpbmUgPSAkKCcubG9hZGVyIC5saW5lJyk7XG5sZXQgcGVyYyA9ICQoJy5sb2FkZXIgLnBlcmNlbnRhZ2UnKTtcbmxldCBwcm9ncmVzcyA9IDA7XG5cbmZ1bmN0aW9uIGEgKHByb2dyZXNzKSB7XG4gIGxpbmUuYW5pbWF0ZSh7d2lkdGg6IGAke3Byb2dyZXNzfSVgfSwgMTAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcGVyYy50ZXh0KGAke3Byb2dyZXNzfSVgKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgdmFyIHRpbWVySWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIHRpY2soKSB7XG4gICAgaWYgKHByb2dyZXNzIDw9IDEwMCkge1xuICAgICAgYShwcm9ncmVzcyk7XG4gICAgICBwcm9ncmVzcysrO1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGljaywgMTAwKTtcbiAgICB9XG4gIH0sIDEwMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBpbml0IH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2xvYWRlci5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTs7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBOzs7Ozs7OztBQ3hDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFFQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTs7Ozs7Ozs7QUNoUkE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFVQTtBQUNBOzs7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=