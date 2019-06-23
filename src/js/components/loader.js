/* Loader */

let line = $('.loader .line');
let perc = $('.loader .percentage');
let progress = 0;

function a (progress) {
  line.animate({width: `${progress}%`}, 100, function () {
    perc.text(`${progress}%`);
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

module.exports = { init };