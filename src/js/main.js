let DeviceDetection = require("./components/device-detection");
let Helpers = require("./components/helpers");
let Animation = require("./components/animation");
let Loader = require("./components/loader");

$(document).ready(function(){

  Loader.init();
  
  DeviceDetection.run();
  Helpers.init();
  
  $.afterlag(function(){
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
  DeviceDetection,
  Helpers,
  Animation,
  Loader,
};