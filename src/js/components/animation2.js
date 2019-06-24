function init() {
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  var Dots = new Array();
  var TOTAL_DOTS = 20;
  var DISTANCE = 70;
  var GRAVITY = 0.0001;

  window.setParams = function() {
    TOTAL_DOTS = 100;
    DISTANCE = 50;

    if (TOTAL_DOTS < Dots.length) {
      var del = Dots.length - TOTAL_DOTS;
      Dots.splice(TOTAL_DOTS, del);
    }
    if (TOTAL_DOTS > Dots.length) {
      var create = TOTAL_DOTS - Dots.length;
      for (var i = 0; i < create; i++) {
        var dot = new Dot();
        Dots.push(dot);
      }
    }
  }

  function Dot() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.r = 2 + 2 * Math.random();
    this.c = 0x86A4C1;

    this.reset();

  }

  Dot.prototype.reset = function() {
    this.x = (Math.random() * WIDTH);
    this.y = (Math.random() * HEIGHT);

    var rand = Math.random();
    this.vx = (2 * Math.random() + 0.1) * 3 / this.r;
    if (rand > .5) {
      this.vx = -1 * this.vx;
    }

    rand = Math.random();
    this.vy = (2 * Math.random() + 0.1) * 3 / this.r;
    if (rand > .5) {
      this.vy = -1 * (2 * Math.random() + 0.1) * 1;
    }
  }

  Dot.prototype.collisionCheck = function() {
    if (this.x < 0 - this.r - DISTANCE) this.x = WIDTH;
    if (this.x > WIDTH + this.r + DISTANCE) this.x = 0;
    if (this.y < 0 - this.r - DISTANCE) this.y = HEIGHT;
    if (this.y > HEIGHT + this.r + DISTANCE) this.y = 0;
  }

  for (var i = 0; i < TOTAL_DOTS; i++) {
    var dot = new Dot();
    Dots.push(dot);
  }

  function distance(x1, y1, x2, y2) {
    var xdiff = x1 - x2;
    var ydiff = y1 - y2;
    return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
  }

  // create a renderer instance.
  var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {
    'transparent':true,
    'autoResize': true,
    'antialias': true,
  });

  // add the renderer view element to the DOM
  document.getElementById('bg-parts').appendChild(renderer.view);

  requestAnimationFrame(animate);
  
  var graphics = new PIXI.Graphics();
  
  function animate() {
    graphics.clear();  
    
    for (var i = 0; i < Dots.length; i++) {
      var dot1 = Dots[i];
      dot1.collisionCheck();
      drawDot(graphics, dot1);

      for (var j = i + 1; j < Dots.length; j++) {
        var dot2 = Dots[j];

        var x1 = dot1.x;
        var x2 = dot2.x;
        var y1 = dot1.y;
        var y2 = dot2.y;

        var dist = distance(x1, y1, x2, y2);
        if (dist <= DISTANCE) {
          var normalizedDist = dist / DISTANCE;
          
          var lineWidth = (dot1.r + dot2.r) * 0.3 / (2 * Math.sqrt(normalizedDist) + 0.00001);
          var alpha = 1.0 - (normalizedDist * normalizedDist);

          graphics.lineStyle(lineWidth, dot.c, alpha);
          
          var x1r = (0.5 + x1) << 0;
          var y1r = (0.5 + y1) << 0;
          var x2r = (0.5 + x2) << 0;
          var y2r = (0.5 + y2) << 0;
          
          graphics.moveTo(x1r, y1r);
          graphics.lineTo(x2r, y2r);
          
          var x1next = dot1.x + dot1.vx;
          var y1next = dot1.y + dot1.vy;
          var x2next = dot2.x + dot2.vx;
          var y2next = dot2.y + dot2.vy;
          var distnext = distance(x1next, y1next, x2next, y2next);
          if (distnext <= dist) {
            // dots are getting closer
            dot1.x += GRAVITY * dot2.r * x2 * Math.pow(normalizedDist, 2);
            dot2.x += GRAVITY * dot1.r * x1 * Math.pow(normalizedDist, 2);
            dot1.y += GRAVITY * dot2.r * y2 * Math.pow(normalizedDist, 2);
            dot2.y += GRAVITY * dot1.r * y1 * Math.pow(normalizedDist, 2);
          } else {
            dot1.x -= GRAVITY * dot2.r * x2 * Math.pow(normalizedDist, 2);
            dot2.x -= GRAVITY * dot1.r * x1 * Math.pow(normalizedDist, 2);
            dot1.y -= GRAVITY * dot2.r * y2 * Math.pow(normalizedDist, 2);
            dot2.y -= GRAVITY * dot1.r * y1 * Math.pow(normalizedDist, 2);
          }

        }
      }

      dot1.y += dot1.vy;
      dot1.x += dot1.vx;
    }

    // render the stage   
    renderer.render(graphics);

    requestAnimationFrame(animate);
  }

  function drawDot(graphics, dot) {
    graphics.beginFill(dot.c, 0.2);
    //graphics.beginFill('#ffffff', 1.0);
    graphics.drawCircle(dot.x, dot.y, dot.r);
    graphics.endFill();
  }
  
};

module.exports = {init};