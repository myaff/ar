/**
 * Youtube
 * @module Youtube
 */

// Init empty array of iframe IDs, one from each video
let iframeIds = [];

// Init empty array of iframe YT objects for use elsewhere
// Here I only use this to iterate through and pause all videos when
// another begins playing
let iframeObjects = [];


// Shared onReady event which adds events to each video's corresponding
// play and stop buttons
function onPlayerReady(event) {
  let iframeObject = event.target;
  let iframeElement = iframeObject.a;
  let videoContainer = $(iframeElement).closest('.yt');
  let modal = videoContainer.closest('.modal');
  let play = videoContainer.find(".play");
  let stop = videoContainer.find(".stop");
  
  // Push current iframe object to array
  iframeObjects.push(iframeObject);

  play.on("click", function() {
    // Pause all videos currently playing
    iframeObjects.forEach(function(scopediframeObject) {
      scopediframeObject.pauseVideo();
      let scopediframeElement = scopediframeObject.a;
      scopediframeElement.classList.remove('isPlaying');
    });
    
    // Play selected video
    iframeObject.playVideo();
    iframeElement.classList.add('isPlaying');
  });
  
  stop.on("click", function() {
    iframeObject.pauseVideo();
    iframeElement.classList.remove('isPlaying');
  });
  
  modal.on('modalclosed', function () {
    iframeObject.pauseVideo();
    iframeElement.classList.remove('isPlaying');
  });
}

/**
 * инициализация событий для переключателей классов
 * @example
 * Youtube.init();
 */

function init(){

  Main.Helpers.addScript("https://www.youtube.com/iframe_api");


  // For each iframe you find, add its ID to the iframeIds array
  let iframes = document.querySelectorAll(".yt iframe");
  iframes.forEach(function(iframe) {
    iframeIds.push(iframe.id);
  });

  // Once the YouTube API is ready, for each iframeId in your array, create
  // a new YT player and give it the onReady event
  window.onYouTubeIframeAPIReady = function () {
    iframeIds.forEach(function(iframeId) {
      var player = new YT.Player(iframeId, {
        events: {
          onReady: onPlayerReady
        }
      });
    });
  }
}

module.exports = {init};