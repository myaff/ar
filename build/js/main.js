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

	  Animation.init();
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

	'use strict';

	/**
	 * Переключение классов по различным событиям
	 * @module Animation
	 */

	var width,
	    height,
	    largeHeader,
	    canvas,
	    ctx,
	    points,
	    target,
	    animateHeader = true;

	function initHeader() {
	    width = window.innerWidth;
	    height = window.innerHeight;
	    target = { x: width / 2, y: height / 2 };

	    largeHeader = document.getElementById('bg-parts');
	    largeHeader.style.height = height + 'px';

	    canvas = document.getElementById('bg-parts-canvas');
	    canvas.width = width;
	    canvas.height = height;
	    ctx = canvas.getContext('2d');

	    // create points
	    points = [];
	    for (var x = 0; x < width; x = x + width / 5) {
	        for (var y = 0; y < height; y = y + height / 5) {
	            var px = x + Math.random() * width / 5;
	            var py = y + Math.random() * height / 5;
	            var p = { x: px, originX: px, y: py, originY: py };
	            points.push(p);
	        }
	    }

	    // for each point find the 5 closest points
	    for (var i = 0; i < points.length; i++) {
	        var closest = [];
	        var p1 = points[i];
	        for (var j = 0; j < points.length; j++) {
	            var p2 = points[j];
	            if (!(p1 == p2)) {
	                var placed = false;
	                for (var k = 0; k < 5; k++) {
	                    if (!placed) {
	                        if (closest[k] == undefined) {
	                            closest[k] = p2;
	                            placed = true;
	                        }
	                    }
	                }

	                for (var k = 0; k < 5; k++) {
	                    if (!placed) {
	                        if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
	                            //if(getDistance(p1, p2) < getDistance(p1, closest[k])/2) {
	                            closest[k] = p2;
	                            placed = true;
	                        }
	                    }
	                }
	            }
	        }
	        p1.closest = closest;
	    }

	    // assign a circle to each point
	    for (var i in points) {
	        var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
	        points[i].circle = c;
	    }
	}

	// Event handling
	function addListeners() {
	    //if(!('ontouchstart' in window)) {
	    //    window.addEventListener('mousemove', mouseMove);
	    //}
	    //window.addEventListener('scroll', scrollCheck);
	    window.addEventListener('resize', resize);
	}

	function mouseMove(e) {
	    var posx = 0;
	    var posy = 0;
	    if (e.pageX || e.pageY) {
	        posx = e.pageX;
	        posy = e.pageY;
	    } else if (e.clientX || e.clientY) {
	        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	    }
	    target.x = posx;
	    target.y = posy;
	}

	function scrollCheck() {
	    if (document.body.scrollTop > height) animateHeader = false;else animateHeader = true;
	}

	function resize() {
	    width = window.innerWidth;
	    height = window.innerHeight;
	    largeHeader.style.height = height + 'px';
	    canvas.width = width;
	    canvas.height = height;
	}

	// animation
	function initAnimation() {
	    animate();
	    for (var i in points) {
	        shiftPoint(points[i]);
	    }
	}

	function animate() {
	    if (animateHeader) {
	        ctx.clearRect(0, 0, width, height);
	        for (var i in points) {
	            // detect points in range
	            if (Math.abs(getDistance(target, points[i])) < 4000) {
	                points[i].active = 0.3;
	                points[i].circle.active = 0.6;
	            } else if (Math.abs(getDistance(target, points[i])) < 20000) {
	                points[i].active = 0.1;
	                points[i].circle.active = 0.3;
	            } else if (Math.abs(getDistance(target, points[i])) < 40000) {
	                points[i].active = 0.02;
	                points[i].circle.active = 0.1;
	            } else {
	                points[i].active = 0;
	                points[i].circle.active = 0;
	            }

	            drawLines(points[i]);
	            points[i].circle.draw();
	        }
	    }
	    requestAnimationFrame(animate);
	}

	function shiftPoint(p) {
	    TweenLite.to(p, 5 + 1 * Math.random(), {
	        x: p.originX - 50 + Math.random() * 100,
	        y: p.originY - 50 + Math.random() * 100,
	        opacity: Math.random(),
	        ease: Circ.easeInOut,
	        onComplete: function onComplete() {
	            shiftPoint(p);
	        }
	    });
	}

	// Canvas manipulation
	function drawLines(p) {
	    //if(!p.active) return;
	    for (var i in p.closest) {
	        //if (i%2 > 0) return;
	        //console.log(getDistance(p, p.closest[i]));
	        if (getDistance(p, p.closest[i]) > 20000) return;
	        ctx.beginPath();
	        ctx.moveTo(p.x, p.y);
	        ctx.lineTo(p.closest[i].x, p.closest[i].y);
	        //ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
	        ctx.strokeStyle = 'rgba(156,217,249,0.2)';
	        ctx.stroke();
	    }
	}

	function Circle(pos, rad, color) {
	    var _this = this;

	    // constructor
	    (function () {
	        _this.pos = pos || null;
	        _this.radius = rad || null;
	        _this.color = color || null;
	    })();

	    this.draw = function () {
	        ctx.beginPath();
	        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
	        if (!_this.active) {
	            ctx.strokeStyle = 'rgba(156,217,249,0.3)';
	            ctx.stroke();
	        } else {
	            ctx.fillStyle = 'rgba(156,217,249,' + _this.active + ')';
	            ctx.fill();
	        }
	    };
	}

	// Util
	function getDistance(p1, p2) {
	    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
	}
	function init() {

	    // Main
	    initHeader();
	    initAnimation();
	    addListeners();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2ZTZjMzNiNTIyZWYzM2Q5ZGFlNyIsIndlYnBhY2s6Ly8vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9jb21wb25lbnRzL2FuaW1hdGlvbi5qcyIsIndlYnBhY2s6Ly8vc3JjL2pzL2NvbXBvbmVudHMvbG9hZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9rZW56by9idWlsZC9qcy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2ZTZjMzNiNTIyZWYzM2Q5ZGFlNyIsImxldCBEZXZpY2VEZXRlY3Rpb24gPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb25cIik7XHJcbmxldCBIZWxwZXJzID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9oZWxwZXJzXCIpO1xyXG5sZXQgQW5pbWF0aW9uID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9hbmltYXRpb25cIik7XHJcbmxldCBMb2FkZXIgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2xvYWRlclwiKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblxyXG4gIExvYWRlci5pbml0KCk7XHJcbiAgXHJcbiAgRGV2aWNlRGV0ZWN0aW9uLnJ1bigpO1xyXG4gIEhlbHBlcnMuaW5pdCgpO1xyXG4gIFxyXG4gICQuYWZ0ZXJsYWcoZnVuY3Rpb24oKXtcclxuICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtbG9hZGVkJyk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1hbmltYXRpbmcnKTtcclxuICBcclxuICBBbmltYXRpb24uaW5pdCgpO1xyXG5cclxuICBcclxufSk7XHJcblxyXG5cclxuLyoqXHJcbiAqINCh0L/QuNGB0L7QuiDRjdC60YHQv9C+0YDRgtC40YDRg9C10LzRi9GFINC80L7QtNGD0LvQtdC5LCDRh9GC0L7QsdGLINC40LzQtdGC0Ywg0Log0L3QuNC8INC00L7RgdGC0YPQvyDQuNC30LLQvdC1XHJcbiAqIEBleGFtcGxlXHJcbiAqIE1haW4uRm9ybS5pc0Zvcm1WYWxpZCgpO1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgRGV2aWNlRGV0ZWN0aW9uLFxyXG4gIEhlbHBlcnMsXHJcbiAgQW5pbWF0aW9uLFxyXG4gIExvYWRlcixcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL21haW4uanMiLCJsZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgc206IDc2NyxcclxuICBtZDogMTAyNCxcclxuICBsZzogMTI4MCxcclxuICB4bDogMTYwMFxyXG59O1xyXG5cclxuZnVuY3Rpb24gaXNQb3J0cmFpdCgpIHtcclxuICByZXR1cm4gKCQod2luZG93KS53aWR0aCgpIDwgJCh3aW5kb3cpLmhlaWdodCgpKTtcclxufVxyXG5mdW5jdGlvbiBpc0xhbmRzY2FwZSgpIHtcclxuICByZXR1cm4gKCQod2luZG93KS53aWR0aCgpID4gJCh3aW5kb3cpLmhlaWdodCgpKTtcclxufVxyXG5mdW5jdGlvbiBpc01vYmlsZSgpe1xyXG4gIHJldHVybiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gYnJlYWtwb2ludHMuc20pO1xyXG59XHJcbmZ1bmN0aW9uIGlzVGFibGV0KCl7XHJcbiAgcmV0dXJuICgkKHdpbmRvdykud2lkdGgoKSA+IGJyZWFrcG9pbnRzLnNtICYmICQod2luZG93KS53aWR0aCgpIDw9IGJyZWFrcG9pbnRzLm1kKVxyXG59XHJcbmZ1bmN0aW9uIGlzRGVza3RvcEV4dCgpe1xyXG4gIHJldHVybiAoJCh3aW5kb3cpLndpZHRoKCkgPj0gYnJlYWtwb2ludHMubWQpXHJcbn1cclxuZnVuY3Rpb24gaXNEZXNrdG9wKCl7XHJcbiAgcmV0dXJuICgkKHdpbmRvdykud2lkdGgoKSA+IGJyZWFrcG9pbnRzLm1kKVxyXG59XHJcbmZ1bmN0aW9uIGlzVG91Y2goKXtcclxuICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8IG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cztcclxufVxyXG5mdW5jdGlvbiBpc01vYmlsZVZlcnNpb24oKXtcclxuICByZXR1cm4gISF+d2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIi9tb2JpbGUvXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBydW4oKXtcclxuICBpZihpc1RvdWNoKCkpe1xyXG4gICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCduby10b3VjaCcpLmFkZENsYXNzKCd0b3VjaCcpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ3RvdWNoJykuYWRkQ2xhc3MoJ25vLXRvdWNoJyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBydW4sXHJcbiAgaXNUb3VjaCxcclxuICBpc01vYmlsZSxcclxuICBpc1RhYmxldCxcclxuICBpc0Rlc2t0b3AsXHJcbiAgaXNEZXNrdG9wRXh0LFxyXG4gIGlzTW9iaWxlVmVyc2lvbixcclxuICBpc1BvcnRyYWl0LFxyXG4gIGlzTGFuZHNjYXBlXHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2RldmljZS1kZXRlY3Rpb24uanMiLCIvKipcclxuICogSGVscGVyc1xyXG4gKiBAbW9kdWxlIEhlbHBlcnNcclxuICovXHJcblxyXG4vLyBBZGQgc2NyaXB0IGFzeW5oXHJcbmZ1bmN0aW9uIGFkZFNjcmlwdCAodXJsKSB7XHJcbiAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiAgdGFnLnNyYyA9IHVybDtcclxuICB2YXIgZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKVswXTtcclxuICBmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YWcsIGZpcnN0U2NyaXB0VGFnKTtcclxufVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG5cclxuICAvLyDQv9GA0L7QstC10YDRj9C10Lwg0L/QvtC00LTQtdGA0LbQutGDXHJcbiAgaWYgKCFFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0KSB7XHJcblxyXG4gICAgLy8g0YDQtdCw0LvQuNC30YPQtdC8XHJcbiAgICBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24oY3NzKSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcztcclxuXHJcbiAgICAgIHdoaWxlIChub2RlKSB7XHJcbiAgICAgICAgaWYgKG5vZGUubWF0Y2hlcyhjc3MpKSByZXR1cm4gbm9kZTtcclxuICAgICAgICBlbHNlIG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbn0pKCk7XHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcblxyXG4gIC8vINC/0YDQvtCy0LXRgNGP0LXQvCDQv9C+0LTQtNC10YDQttC60YNcclxuICBpZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIHtcclxuXHJcbiAgICAvLyDQvtC/0YDQtdC00LXQu9GP0LXQvCDRgdCy0L7QudGB0YLQstC+XHJcbiAgICBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICAgIEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgICBFbGVtZW50LnByb3RvdHlwZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcclxuICAgICAgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3I7XHJcblxyXG4gIH1cclxuXHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlIHNjcm9sbGJhciB3aWR0aCBpbiBlbGVtZW50XHJcbiAqIC0gaWYgdGhlIHdpZHRoIGlzIDAgaXQgbWVhbnMgdGhlIHNjcm9sbGJhciBpcyBmbG9hdGVkL292ZXJsYXllZFxyXG4gKiAtIGFjY2VwdHMgXCJjb250YWluZXJcIiBwYXJlbWV0ZXIgYmVjYXVzZSBpZSAmIGVkZ2UgY2FuIGhhdmUgZGlmZmVyZW50XHJcbiAqICAgc2Nyb2xsYmFyIGJlaGF2aW9ycyBmb3IgZGlmZmVyZW50IGVsZW1lbnRzIHVzaW5nICctbXMtb3ZlcmZsb3ctc3R5bGUnXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXROYXRpdmVTY3JvbGxiYXJXaWR0aCAoY29udGFpbmVyKSB7XHJcbiAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gIGxldCBmdWxsV2lkdGggPSAwO1xyXG4gIGxldCBiYXJXaWR0aCA9IDA7XHJcblxyXG4gIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgbGV0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gIHdyYXBwZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gIHdyYXBwZXIuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICB3cmFwcGVyLnN0eWxlLmJvdHRvbSA9ICcwJztcclxuICB3cmFwcGVyLnN0eWxlLnJpZ2h0ID0gJzAnO1xyXG4gIHdyYXBwZXIuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xyXG4gIHdyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG5cclxuICBmdWxsV2lkdGggPSBjaGlsZC5vZmZzZXRXaWR0aDtcclxuICB3cmFwcGVyLnN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xyXG4gIGJhcldpZHRoID0gZnVsbFdpZHRoIC0gY2hpbGQub2Zmc2V0V2lkdGg7XHJcblxyXG4gIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcclxuXHJcbiAgcmV0dXJuIGJhcldpZHRoO1xyXG59XHJcblxyXG5sZXQgdGltZXI7XHJcbmxldCB0aW1lb3V0ID0gZmFsc2U7XHJcbmxldCBkZWx0YSA9IDIwMDtcclxuZnVuY3Rpb24gcmVzaXplRW5kKCkge1xyXG4gIGlmIChuZXcgRGF0ZSgpIC0gdGltZXIgPCBkZWx0YSkge1xyXG4gICAgc2V0VGltZW91dChyZXNpemVFbmQsIGRlbHRhKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZWVuZCcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3NJZihlbCwgY29uZCwgdG9nZ2xlZENsYXNzKXtcclxuXHRpZihjb25kKXtcclxuXHRcdGVsLmFkZENsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGVsLnJlbW92ZUNsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICog0KTRg9C90LrRhtC40Y8g0LTQvtCx0LDQstC70Y/QtdGCINC6INGN0LvQtdC80LXQvdGC0YMg0LrQu9Cw0YHRgSwg0LXRgdC70Lgg0YHRgtGA0LDQvdC40YbQsCDQv9GA0L7QutGA0YPRh9C10L3QsCDQsdC+0LvRjNGI0LUsINGH0LXQvCDQvdCwINGD0LrQsNC30LDQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1LCBcclxuICog0Lgg0YPQsdC40YDQsNC10YIg0LrQu9Cw0YHRgSwg0LXRgdC70Lgg0LfQvdCw0YfQtdC90LjQtSDQvNC10L3RjNGI0LVcclxuICogQHBhcmFtIHtvYmplY3R9IGVsIC0g0Y3Qu9C10LzQtdC90YIsINGBINC60L7RgtC+0YDRi9C8INCy0LfQsNC40LzQvtC00LXQudGB0YLQstGD0LXQvFxyXG4gKiBAcGFyYW0ge21peGVkfSBbc2Nyb2xsVmFsdWU9MF0gLSDQt9C90LDRh9C10L3QuNC1INC/0YDQvtC60YDRg9GC0LrQuCwg0L3QsCDQutC+0YLQvtGA0L7QvCDQvNC10L3Rj9C10LwgY3NzLdC60LvQsNGB0YEsINC+0LbQuNC00LDQtdC80L7QtSDQt9C90LDRh9C10L3QuNC1IC0g0YfQuNGB0LvQviDQuNC70Lgg0LrQu9GO0YfQtdCy0L7QtSDRgdC70L7QstC+ICd0aGlzJy4g0JXRgdC70Lgg0L/QtdGA0LXQtNCw0L3QviAndGhpcycsINC/0L7QtNGB0YLQsNCy0LvRj9C10YLRgdGPINC/0L7Qu9C+0LbQtdC90LjQtSBlbC5vZmZzZXQoKS50b3Ag0LzQuNC90YPRgSDQv9C+0LvQvtCy0LjQvdCwINCy0YvRgdC+0YLRiyDRjdC60YDQsNC90LBcclxuICogQHBhcmFtIHtzdHJpbmd9IFt0b2dnbGVkQ2xhc3M9c2Nyb2xsZWRdIC0gY3NzLdC60LvQsNGB0YEsINC60L7RgtC+0YDRi9C5INC/0LXRgNC10LrQu9GO0YfQsNC10LxcclxuICovXHJcbmZ1bmN0aW9uIHRvZ2dsZUVsZW1lbnRDbGFzc09uU2Nyb2xsKGVsLCBzY3JvbGxWYWx1ZSA9IDAsIHRvZ2dsZWRDbGFzcyA9ICdzY3JvbGxlZCcpe1xyXG5cdGlmKGVsLmxlbmd0aCA9PSAwKSB7XHJcblx0XHQvL2NvbnNvbGUuZXJyb3IoXCLQndC10L7QsdGF0L7QtNC40LzQviDQv9C10YDQtdC00LDRgtGMINC+0LHRitC10LrRgiwg0YEg0LrQvtGC0L7RgNGL0Lwg0LLRiyDRhdC+0YLQuNGC0LUg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0L7QstCw0YLRjFwiKTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0aWYoc2Nyb2xsVmFsdWUgPT0gJ3RoaXMnKSB7XHJcblx0XHRzY3JvbGxWYWx1ZSA9IGVsLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5vdXRlckhlaWdodCgpIC8gMjtcclxuXHR9XHJcblx0XHJcblx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbihlKXtcclxuXHRcdGlmKCQod2luZG93KS5zY3JvbGxUb3AoKSA+IHNjcm9sbFZhbHVlKXtcclxuXHRcdFx0ZWwuYWRkQ2xhc3ModG9nZ2xlZENsYXNzKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsLnJlbW92ZUNsYXNzKHRvZ2dsZWRDbGFzcyk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG4vKiBNb2RhbHMgKi9cclxuZnVuY3Rpb24gb3Blbk1vZGFsKG1vZGFsKSB7XHJcbiAgaWYgKG1vZGFsKSB7XHJcbiAgICBtb2RhbC5mYWRlSW4oNTAwKTtcclxuICAgICQoJ2h0bWwsIGJvZHknKS5jc3MoJ292ZXJmbG93LXknLCAnaGlkZGVuJyk7XHJcbiAgICBtb2RhbC50cmlnZ2VyKCdtb2RhbG9wZW5lZCcpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdXaGljaCBtb2RhbD8nKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlTW9kYWwobW9kYWwpIHtcclxuICBpZiAobW9kYWwpIHtcclxuICAgIG1vZGFsLmZhZGVPdXQoNTAwKTtcclxuICAgICQoJ2h0bWwsIGJvZHknKS5jc3MoJ292ZXJmbG93LXknLCAnJyk7XHJcbiAgICBtb2RhbC50cmlnZ2VyKCdtb2RhbGNsb3NlZCcpXHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1doaWNoIG1vZGFsPycpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2V0U2Nyb2xscGFkKGVscykge1xyXG4gIGlmICgkKCcubGF5b3V0Jykub3V0ZXJIZWlnaHQoKSA+IHdpbmRvdy5vdXRlckhlaWdodCkge1xyXG4gICAgZWxzLmNzcyh7J3BhZGRpbmctcmlnaHQnOiBnZXROYXRpdmVTY3JvbGxiYXJXaWR0aCgpICsgJ3B4J30pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBlbHMuY3NzKHsncGFkZGluZy1yaWdodCc6ICcwcHgnfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKiBNZW51ICovXHJcbmZ1bmN0aW9uIHNob3dNZW51KCkge1xyXG4gICQoJy5tYWluLW1lbnUnKS5hZGRDbGFzcygnaXMtb3BlbicpO1xyXG4gICQoJy5idG4tbWVudScpLmFkZENsYXNzKCdpcy1vcGVuJyk7XHJcbiAgJCgnYm9keScpLmFkZENsYXNzKCdtZW51LWlzLW9wZW4nKTtcclxuICBpZiAoJCgnLmxheW91dCcpLm91dGVySGVpZ2h0KCkgPiB3aW5kb3cub3V0ZXJIZWlnaHQpIHtcclxuICAgICQoJy5oZWFkZXInKS5jc3MoeydyaWdodCc6IGdldE5hdGl2ZVNjcm9sbGJhcldpZHRoKCkgKyAncHgnfSk7XHJcbiAgICAkKCdodG1sLCBib2R5JykuY3NzKCdvdmVyZmxvdy15JywgJ2hpZGRlbicpO1xyXG4gIH1cclxuICAkKCcubWFpbi1tZW51JykuZmFkZUluKDUwMCk7XHJcbn1cclxuZnVuY3Rpb24gaGlkZU1lbnUoKSB7XHJcbiAgJCgnLm1haW4tbWVudScpLmZhZGVPdXQoNTAwKTtcclxuICAkKCcubWFpbi1tZW51JykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcclxuICAkKCcuYnRuLW1lbnUnKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xyXG4gICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbWVudS1pcy1vcGVuJyk7XHJcbiAgaWYgKCQoJy5sYXlvdXQnKS5vdXRlckhlaWdodCgpID4gd2luZG93Lm91dGVySGVpZ2h0KSB7XHJcbiAgICAkKCcuaGVhZGVyJykuY3NzKHsncmlnaHQnOiAnMHB4J30pO1xyXG4gICAgJCgnaHRtbCwgYm9keScpLmNzcygnb3ZlcmZsb3cteScsICcnKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICog0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtCx0YvRgtC40Lkg0LTQu9GPINC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9C10Lkg0LrQu9Cw0YHRgdC+0LJcclxuICogQGV4YW1wbGVcclxuICogSGVscGVycy5pbml0KCk7XHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0KCl7XHJcbiAgXHJcbiAgdG9nZ2xlRWxlbWVudENsYXNzT25TY3JvbGwoJCgnLmhlYWRlcicpLCA1MCk7XHJcbiAgXHJcbiAgJCgnLmpzLXRvZ2dsZS1ibG9jaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSA9PT0gJ3NlbGYnID8gJCh0aGlzKS5wYXJlbnQoKSA6ICQoJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSk7XHJcbiAgICBpZiAodGFyZ2V0Lmhhc0NsYXNzKCdvZmYnKSkge1xyXG4gICAgICB0YXJnZXQucmVtb3ZlQ2xhc3MoJ29mZicpLmZhZGVJbig1MDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGFyZ2V0LmFkZENsYXNzKCdvZmYnKS5mYWRlT3V0KDUwMCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJy5idG4tY2xvc2UtcG9wdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgbGV0IG1vZGFsID0gISEkKHRoaXMpLmRhdGEoJ3RhcmdldCcpID8gJCgkKHRoaXMpLmRhdGEoJ3RhcmdldCcpKSA6ICQodGhpcykuY2xvc2VzdCgnLnBvcHVwJyk7XHJcbiAgICBjbG9zZU1vZGFsKG1vZGFsKTtcclxuICB9KTtcclxuXHJcbiAgJCgnLmJ0bi1wb3B1cCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoJ3RhcmdldCcpID09PSAnc2VsZicgPyAkKHRoaXMpLnBhcmVudCgpIDogJCgkKHRoaXMpLmRhdGEoJ3RhcmdldCcpKTtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIG9wZW5Nb2RhbCh0YXJnZXQpO1xyXG4gIH0pO1xyXG5cclxuICBcclxuICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIHRpbWVyID0gbmV3IERhdGUoKTtcclxuICAgIGlmICh0aW1lb3V0ID09PSBmYWxzZSkge1xyXG4gICAgICB0aW1lb3V0ID0gdHJ1ZTtcclxuICAgICAgc2V0VGltZW91dChyZXNpemVFbmQsIGRlbHRhKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLypcclxuICBzZXRTY3JvbGxwYWQoJCgnLmxheW91dCwgLmhlYWRlcicpKTtcclxuXHJcbiAgJCh3aW5kb3cpLm9uKCdyZXNpemVlbmQnLCBmdW5jdGlvbigpe1xyXG4gICAgc2V0U2Nyb2xscGFkKCQoJy5sYXlvdXQsIC5oZWFkZXInKSk7XHJcbiAgfSk7XHJcbiAgKi9cclxuICBcclxuICAkKCcuYnRuLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmICgkKCdib2R5JykuaGFzQ2xhc3MoJ21lbnUtaXMtb3BlbicpKSB7XHJcbiAgICAgIGhpZGVNZW51KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzaG93TWVudSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gICQoJy5idG4tY2xvc2UtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaGlkZU1lbnUoKTtcclxuICB9KTtcclxuXHJcbiAgLypcclxuICAkKHdpbmRvdykub24oJ3Jlc2l6ZWVuZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZiAoTWFpbi5EZXZpY2VEZXRlY3Rpb24uaXNNb2JpbGUoKSkge1xyXG4gICAgICBoaWRlTWVudSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2hvd01lbnUoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgaWYgKE1haW4uRGV2aWNlRGV0ZWN0aW9uLmlzUG9ydHJhaXQoKSkge1xyXG4gICAgJCgnaHRtbCcpLmFkZENsYXNzKCdyb3RhdGVkJyk7XHJcbiAgICAkKCcucm90YXRlJykuZmFkZUluKDUwMCk7XHJcbiAgfVxyXG5cclxuICAkKHdpbmRvdykub24oJ3Jlc2l6ZWVuZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBpZiAoTWFpbi5EZXZpY2VEZXRlY3Rpb24uaXNQb3J0cmFpdCgpKSB7XHJcbiAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygncm90YXRlZCcpO1xyXG4gICAgICAkKCcucm90YXRlJykuZmFkZUluKDUwMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcucm90YXRlJykuZmFkZU91dCg1MDApO1xyXG4gICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ3JvdGF0ZWQnKTtcclxuICAgIH1cclxuICB9KTtcclxuICAqL1xyXG5cclxuICAkKHdpbmRvdykuc2Nyb2xsKCQuZGVib3VuY2UoMjUwLCB0cnVlLCBmdW5jdGlvbigpIHtcclxuICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtc2Nyb2xsaW5nJyk7XHJcbiAgfSkpO1xyXG4gICQod2luZG93KS5zY3JvbGwoJC5kZWJvdW5jZSgyNTAsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdpcy1zY3JvbGxpbmcnKTtcclxuICB9KSk7XHJcbiAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGluaXQsIFxyXG4gIGdldE5hdGl2ZVNjcm9sbGJhcldpZHRoLFxyXG4gIHRvZ2dsZUNsYXNzSWYsIFxyXG4gIHRvZ2dsZUVsZW1lbnRDbGFzc09uU2Nyb2xsLCBcclxuICBhZGRTY3JpcHQsIFxyXG4gIG9wZW5Nb2RhbCwgXHJcbiAgY2xvc2VNb2RhbCxcclxuICBzaG93TWVudSxcclxuICBoaWRlTWVudVxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9oZWxwZXJzLmpzIiwiLyoqXHJcbiAqINCf0LXRgNC10LrQu9GO0YfQtdC90LjQtSDQutC70LDRgdGB0L7QsiDQv9C+INGA0LDQt9C70LjRh9C90YvQvCDRgdC+0LHRi9GC0LjRj9C8XHJcbiAqIEBtb2R1bGUgQW5pbWF0aW9uXHJcbiAqL1xyXG5cclxudmFyIHdpZHRoLCBoZWlnaHQsIGxhcmdlSGVhZGVyLCBjYW52YXMsIGN0eCwgcG9pbnRzLCB0YXJnZXQsIGFuaW1hdGVIZWFkZXIgPSB0cnVlO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGluaXRIZWFkZXIoKSB7XHJcbiAgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgdGFyZ2V0ID0ge3g6IHdpZHRoLzIsIHk6IGhlaWdodC8yfTtcclxuXHJcbiAgbGFyZ2VIZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmctcGFydHMnKTtcclxuICBsYXJnZUhlYWRlci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQrJ3B4JztcclxuXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JnLXBhcnRzLWNhbnZhcycpO1xyXG4gIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gIC8vIGNyZWF0ZSBwb2ludHNcclxuICBwb2ludHMgPSBbXTtcclxuICBmb3IodmFyIHggPSAwOyB4IDwgd2lkdGg7IHggPSB4ICsgd2lkdGgvNSkge1xyXG4gICAgICBmb3IodmFyIHkgPSAwOyB5IDwgaGVpZ2h0OyB5ID0geSArIGhlaWdodC81KSB7XHJcbiAgICAgICAgICB2YXIgcHggPSB4ICsgTWF0aC5yYW5kb20oKSp3aWR0aC81O1xyXG4gICAgICAgICAgdmFyIHB5ID0geSArIE1hdGgucmFuZG9tKCkqaGVpZ2h0LzU7XHJcbiAgICAgICAgICB2YXIgcCA9IHt4OiBweCwgb3JpZ2luWDogcHgsIHk6IHB5LCBvcmlnaW5ZOiBweSB9O1xyXG4gICAgICAgICAgcG9pbnRzLnB1c2gocCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGZvciBlYWNoIHBvaW50IGZpbmQgdGhlIDUgY2xvc2VzdCBwb2ludHNcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjbG9zZXN0ID0gW107XHJcbiAgICAgIHZhciBwMSA9IHBvaW50c1tpXTtcclxuICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHBvaW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgdmFyIHAyID0gcG9pbnRzW2pdXHJcbiAgICAgICAgICBpZighKHAxID09IHAyKSkge1xyXG4gICAgICAgICAgICAgIHZhciBwbGFjZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBmb3IodmFyIGsgPSAwOyBrIDwgNTsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKCFwbGFjZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKGNsb3Nlc3Rba10gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VzdFtrXSA9IHAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGZvcih2YXIgayA9IDA7IGsgPCA1OyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYoIXBsYWNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYoZ2V0RGlzdGFuY2UocDEsIHAyKSA8IGdldERpc3RhbmNlKHAxLCBjbG9zZXN0W2tdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgLy9pZihnZXREaXN0YW5jZShwMSwgcDIpIDwgZ2V0RGlzdGFuY2UocDEsIGNsb3Nlc3Rba10pLzIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZXN0W2tdID0gcDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBwMS5jbG9zZXN0ID0gY2xvc2VzdDtcclxuICB9XHJcblxyXG4gIC8vIGFzc2lnbiBhIGNpcmNsZSB0byBlYWNoIHBvaW50XHJcbiAgZm9yKHZhciBpIGluIHBvaW50cykge1xyXG4gICAgICB2YXIgYyA9IG5ldyBDaXJjbGUocG9pbnRzW2ldLCAyK01hdGgucmFuZG9tKCkqMiwgJ3JnYmEoMjU1LDI1NSwyNTUsMC4zKScpO1xyXG4gICAgICBwb2ludHNbaV0uY2lyY2xlID0gYztcclxuICB9XHJcbn1cclxuXHJcbi8vIEV2ZW50IGhhbmRsaW5nXHJcbmZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuICAvL2lmKCEoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSkge1xyXG4gIC8vICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpO1xyXG4gIC8vfVxyXG4gIC8vd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbENoZWNrKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbW91c2VNb3ZlKGUpIHtcclxuICB2YXIgcG9zeCA9IDA7XHJcbiAgdmFyIHBvc3kgPSAwO1xyXG4gIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcclxuICAgICAgcG9zeCA9IGUucGFnZVg7XHJcbiAgICAgIHBvc3kgPSBlLnBhZ2VZO1xyXG4gIH0gZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkge1xyXG4gICAgICBwb3N4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgIHBvc3kgPSBlLmNsaWVudFkgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgfVxyXG4gIHRhcmdldC54ID0gcG9zeDtcclxuICB0YXJnZXQueSA9IHBvc3k7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbENoZWNrKCkge1xyXG4gIGlmKGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID4gaGVpZ2h0KSBhbmltYXRlSGVhZGVyID0gZmFsc2U7XHJcbiAgZWxzZSBhbmltYXRlSGVhZGVyID0gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzaXplKCkge1xyXG4gIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gIGxhcmdlSGVhZGVyLnN0eWxlLmhlaWdodCA9IGhlaWdodCsncHgnO1xyXG4gIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbn1cclxuXHJcbi8vIGFuaW1hdGlvblxyXG5mdW5jdGlvbiBpbml0QW5pbWF0aW9uKCkge1xyXG4gIGFuaW1hdGUoKTtcclxuICBmb3IodmFyIGkgaW4gcG9pbnRzKSB7XHJcbiAgICAgIHNoaWZ0UG9pbnQocG9pbnRzW2ldKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcbiAgaWYoYW5pbWF0ZUhlYWRlcikge1xyXG4gICAgICBjdHguY2xlYXJSZWN0KDAsMCx3aWR0aCxoZWlnaHQpO1xyXG4gICAgICBmb3IodmFyIGkgaW4gcG9pbnRzKSB7XHJcbiAgICAgICAgICAvLyBkZXRlY3QgcG9pbnRzIGluIHJhbmdlXHJcbiAgICAgICAgICBpZihNYXRoLmFicyhnZXREaXN0YW5jZSh0YXJnZXQsIHBvaW50c1tpXSkpIDwgNDAwMCkge1xyXG4gICAgICAgICAgICAgIHBvaW50c1tpXS5hY3RpdmUgPSAwLjM7XHJcbiAgICAgICAgICAgICAgcG9pbnRzW2ldLmNpcmNsZS5hY3RpdmUgPSAwLjY7XHJcbiAgICAgICAgICB9IGVsc2UgaWYoTWF0aC5hYnMoZ2V0RGlzdGFuY2UodGFyZ2V0LCBwb2ludHNbaV0pKSA8IDIwMDAwKSB7XHJcbiAgICAgICAgICAgICAgcG9pbnRzW2ldLmFjdGl2ZSA9IDAuMTtcclxuICAgICAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmFjdGl2ZSA9IDAuMztcclxuICAgICAgICAgIH0gZWxzZSBpZihNYXRoLmFicyhnZXREaXN0YW5jZSh0YXJnZXQsIHBvaW50c1tpXSkpIDwgNDAwMDApIHtcclxuICAgICAgICAgICAgICBwb2ludHNbaV0uYWN0aXZlID0gMC4wMjtcclxuICAgICAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmFjdGl2ZSA9IDAuMTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcG9pbnRzW2ldLmFjdGl2ZSA9IDA7XHJcbiAgICAgICAgICAgICAgcG9pbnRzW2ldLmNpcmNsZS5hY3RpdmUgPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRyYXdMaW5lcyhwb2ludHNbaV0pO1xyXG4gICAgICAgICAgcG9pbnRzW2ldLmNpcmNsZS5kcmF3KCk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaGlmdFBvaW50KHApIHtcclxuICBUd2VlbkxpdGUudG8ocCwgNSsxKk1hdGgucmFuZG9tKCksIHtcclxuICAgIHg6IHAub3JpZ2luWC01MCtNYXRoLnJhbmRvbSgpKjEwMCxcclxuICAgIHk6IHAub3JpZ2luWS01MCtNYXRoLnJhbmRvbSgpKjEwMCwgXHJcbiAgICBvcGFjaXR5OiBNYXRoLnJhbmRvbSgpLFxyXG4gICAgZWFzZTpDaXJjLmVhc2VJbk91dCxcclxuICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNoaWZ0UG9pbnQocCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vIENhbnZhcyBtYW5pcHVsYXRpb25cclxuZnVuY3Rpb24gZHJhd0xpbmVzKHApIHtcclxuICAvL2lmKCFwLmFjdGl2ZSkgcmV0dXJuO1xyXG4gIGZvcih2YXIgaSBpbiBwLmNsb3Nlc3QpIHtcclxuICAgICAgLy9pZiAoaSUyID4gMCkgcmV0dXJuO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGdldERpc3RhbmNlKHAsIHAuY2xvc2VzdFtpXSkpO1xyXG4gICAgICBpZiAoZ2V0RGlzdGFuY2UocCwgcC5jbG9zZXN0W2ldKSA+IDIwMDAwKSByZXR1cm47XHJcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgY3R4Lm1vdmVUbyhwLngsIHAueSk7XHJcbiAgICAgIGN0eC5saW5lVG8ocC5jbG9zZXN0W2ldLngsIHAuY2xvc2VzdFtpXS55KTtcclxuICAgICAgLy9jdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNTYsMjE3LDI0OSwnKyBwLmFjdGl2ZSsnKSc7XHJcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE1NiwyMTcsMjQ5LDAuMiknO1xyXG4gICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBDaXJjbGUocG9zLHJhZCxjb2xvcikge1xyXG4gIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gIC8vIGNvbnN0cnVjdG9yXHJcbiAgKGZ1bmN0aW9uKCkge1xyXG4gICAgICBfdGhpcy5wb3MgPSBwb3MgfHwgbnVsbDtcclxuICAgICAgX3RoaXMucmFkaXVzID0gcmFkIHx8IG51bGw7XHJcbiAgICAgIF90aGlzLmNvbG9yID0gY29sb3IgfHwgbnVsbDtcclxuICB9KSgpO1xyXG5cclxuICB0aGlzLmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjdHguYXJjKF90aGlzLnBvcy54LCBfdGhpcy5wb3MueSwgX3RoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgICBpZighX3RoaXMuYWN0aXZlKSB7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMTU2LDIxNywyNDksMC4zKSc7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxNTYsMjE3LDI0OSwnKyBfdGhpcy5hY3RpdmUrJyknO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vLyBVdGlsXHJcbmZ1bmN0aW9uIGdldERpc3RhbmNlKHAxLCBwMikge1xyXG4gIHJldHVybiBNYXRoLnBvdyhwMS54IC0gcDIueCwgMikgKyBNYXRoLnBvdyhwMS55IC0gcDIueSwgMik7XHJcbn1cclxuZnVuY3Rpb24gaW5pdCAoKSB7XHJcblxyXG5cclxuICAgIC8vIE1haW5cclxuICAgIGluaXRIZWFkZXIoKTtcclxuICAgIGluaXRBbmltYXRpb24oKTtcclxuICAgIGFkZExpc3RlbmVycygpO1xyXG4gICAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2luaXR9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvY29tcG9uZW50cy9hbmltYXRpb24uanMiLCIvKiBMb2FkZXIgKi9cblxubGV0IGxpbmUgPSAkKCcubG9hZGVyIC5saW5lJyk7XG5sZXQgcGVyYyA9ICQoJy5sb2FkZXIgLnBlcmNlbnRhZ2UnKTtcbmxldCBwcm9ncmVzcyA9IDA7XG5cbmZ1bmN0aW9uIGEgKHByb2dyZXNzKSB7XG4gIGxpbmUuYW5pbWF0ZSh7d2lkdGg6IGAke3Byb2dyZXNzfSVgfSwgMTAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcGVyYy50ZXh0KGAke3Byb2dyZXNzfSVgKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgdmFyIHRpbWVySWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIHRpY2soKSB7XG4gICAgaWYgKHByb2dyZXNzIDw9IDEwMCkge1xuICAgICAgYShwcm9ncmVzcyk7XG4gICAgICBwcm9ncmVzcysrO1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGljaywgMTAwKTtcbiAgICB9XG4gIH0sIDEwMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBpbml0IH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9jb21wb25lbnRzL2xvYWRlci5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTs7Ozs7Ozs7QUN4Q0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7Ozs7Ozs7O0FDaFJBOzs7OztBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7Ozs7Ozs7OztBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==