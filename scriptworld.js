/**
 * Particle Network Animation
 * Inspiration: https://github.com/JulianLaval/canvas-particle-network
 */

// Handle Speed
function Speed() {
  this.cur = 1;
  this.new = 11;
  this.old = 51;
  this.change = false;
  var self = this;
  this.set = function(speed, time, duration) {
    setTimeout(function() {
      // Set speed
      self.old = self.cur;
      self.new = speed;

      // Start updating the speed
      self.updateSpeed(duration);
    }, time * 100);
  };

  this.updateSpeed = function(duration) {
    if (duration === undefined)
      duration = 1;

    // Change speed by 1% of the difference every x/duration[ms]
    change = setInterval(function() {
      // calc change
      var speedChange = (self.new - self.old) / 100;

      if (self.cur < self.new - 0.01)
        self.cur += speedChange;
      else if (self.cur > self.new + 0.01)
        self.cur += speedChange;
      else {
        self.cur = self.new;
        clearInterval(change);
        change = false;
        console.log("Speed changed to " + self.cur);
      }
    }, 10 * duration);
  };
}

var speed = new Speed();
speed.set(5, 2, 1);

var ParticleNetworkAnimation, PNA;

ParticleNetworkAnimation = PNA = function() {};

PNA.prototype.init = function(element) {
  this.$el = $(element);

  this.container = element;
  this.canvas = document.createElement('canvas');
  this.sizeCanvas();
  this.container.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
  this.particleNetwork = new ParticleNetwork(this);

  this.bindUiActions();

  return this;
};

PNA.prototype.bindUiActions = function() {
  $(window).on('resize', function() {
    // this.sizeContainer();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.sizeCanvas();
    this.particleNetwork.createParticles();
  }.bind(this));
};

PNA.prototype.sizeCanvas = function() {
  this.canvas.width = this.container.offsetWidth;
  this.canvas.height = this.container.offsetHeight;
};

var Particle = function(parent, x, y) {
  this.network = parent;
  this.canvas = parent.canvas;
  this.ctx = parent.ctx;
  this.particleColor = returnRandomArrayitem(this.network.options.particleColors);
  this.radius = getLimitedRandom(1.5, 2.5);
  this.netLineDistance = 200;
  this.opacity = 0;
  this.blendingSpeed = 0.01;
  this.blendingDelay = 0;
  this.fadeIn = true;
  this.text = false;
  this.x = x || Math.random() * this.canvas.width;
  this.y = y || Math.random() * this.canvas.height;
  this.velocity = {
    x: (Math.random() - 0.5) * parent.options.velocity,
    y: (Math.random() - 0.5) * parent.options.velocity
  };
};

Particle.prototype.update = function() {
  var self = this;
  if (this.fadeIn === true && this.opacity < 1) {
    this.opacity += this.blendingSpeed;
  }
  else if (this.opacity > 1)
    this.opacity = 1;
    
  // Change dir if outside map
  if (this.x > this.canvas.width + 100 || this.x < -100) {
    this.velocity.x = -this.velocity.x;
  }
  if (this.y > this.canvas.height + 100 || this.y < -100) {
    this.velocity.y = -this.velocity.y;
  }

  // Update position
  this.x += this.velocity.x * speed.cur;
  this.y += this.velocity.y * speed.cur;
};

Particle.prototype.draw = function() {
  // Draw particle
  this.ctx.beginPath();
  this.ctx.fillStyle = this.particleColor;
  this.ctx.globalAlpha = this.opacity;
  this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  this.ctx.fill();
};

Particle.prototype.setFadeIn = function(duration, delay) {
  var self = this;
  this.fadeIn = false;
  setTimeout(function() {
    console.log("startFadeIn");
    if (duration === 0)
      self.blendingSpeed = 1;
    else
      self.blendingSpeed = 0.01/duration;
    self.fadeIn = setInterval(function() {
      console.log("Interval: " + self.opactiy + " += " + self.blendingSpeed);
      self.opacity += self.blendingSpeed;
      if (self.opacity >= 1)  {
        self.opacity = 1;
        clearInterval(self.fadeIn);
        self.fadeIn = false;
      }
    }, 10);
  }, delay*1000);
};

var ParticleNetwork = function(parent) {
  this.options = {
    velocity: 2, // the higher the faster
    density: 15000, // the lower the denser
    netLineColor: '#ffffff',
    particleColors: ['#ffffff'] // ['#6D4E5C', '#aaa', '#FFC458' ]
  };
  this.canvas = parent.canvas;
  this.ctx = parent.ctx;

  this.init();
};

ParticleNetwork.prototype.init = function() {
  // Create particle objects
  this.createParticles(true);

  // Update canvas
  this.animationFrame = requestAnimationFrame(this.update.bind(this));

  this.bindUiActions();

  // Write(text, x, y, size, spacing, lineRadius)
  this.write("", 200, 300, 12, 40, 70);
  this.write("", 1000, 650, 4, -20, 22);
};

ParticleNetwork.prototype.createParticles = function(isInitial) {
  // Initialise /  reset particles
  var me = this;
  this.particles = [];
  var quantity = this.canvas.width * this.canvas.height / this.options.density;

  if (isInitial) {
    var counter = 0;
    clearInterval(this.createIntervalId);
    this.createIntervalId = setInterval(function() {
      if (counter < quantity - 1) {
        // Create particle object
        this.particles.push(new Particle(this));
      } else {
        clearInterval(me.createIntervalId);
      }
      counter++;
    }.bind(this), 250);
  } else {
    // Create particle objects
    for (var i = 0; i < quantity; i++) {
      this.particles.push(new Particle(this));
    }
  }
};

ParticleNetwork.prototype.createInteractionParticle = function() {
  // Add interaction particle
  this.interactionParticle = new Particle(this);
  this.interactionParticle.velocity = {
    x: 0,
    y: 0
  };
  this.particles.push(this.interactionParticle);
  return this.interactionParticle;
};

ParticleNetwork.prototype.removeInteractionParticle = function() {
  // Find it
  var index = this.particles.indexOf(this.interactionParticle);
  if (index > -1) {
    // Remove it
    this.interactionParticle = undefined;
    this.particles.splice(index, 1);
  }
};

ParticleNetwork.prototype.update = function() {
  if (this.canvas) {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;

    // Draw connections
    for (var i = 0; i < this.particles.length; i++) {
      for (var j = this.particles.length - 1; j > i; j--) {
        var distance, p1 = this.particles[i],
          p2 = this.particles[j];
        
        // Get smaller netLineDistance
        var netLineDistance = (p1.netLineDistance < p2.netLineDistance)? p1.netLineDistance : p2.netLineDistance;
        
        // check very simply if the two points are even a candidate for further measurements
        distance = Math.min(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
        if (distance > netLineDistance) {
          continue;
        }

        // the two points seem close enough, now let's measure precisely
        distance = Math.sqrt(
          Math.pow(p1.x - p2.x, 2) +
          Math.pow(p1.y - p2.y, 2)
        );
        if (distance > netLineDistance) {
          continue;
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.options.netLineColor;
        this.ctx.globalAlpha = (netLineDistance - distance) / netLineDistance * p1.opacity * p2.opacity;
        this.ctx.lineWidth =1.5;
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    }

    // Draw particles
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();
    }

    if (this.options.velocity !== 0) {
      this.animationFrame = requestAnimationFrame(this.update.bind(this));
    }

  } else {
    cancelAnimationFrame(this.animationFrame);
  }
};

ParticleNetwork.prototype.bindUiActions = function() {
  // Mouse / touch event handling
  this.spawnQuantity = 3;
  this.mouseIsDown = false;
  this.touchIsMoving = false;

  this.onMouseMove = function(e) {
    if (!this.interactionParticle) {
      this.createInteractionParticle();
    }
    this.interactionParticle.x = e.offsetX;
    this.interactionParticle.y = e.offsetY;
  }.bind(this);

  this.onTouchMove = function(e) {
    e.preventDefault();
    this.touchIsMoving = true;
    if (!this.interactionParticle) {
      this.createInteractionParticle();
    }
    this.interactionParticle.x = e.changedTouches[0].clientX;
    this.interactionParticle.y = e.changedTouches[0].clientY;
  }.bind(this);

  this.onMouseDown = function(e) {
    this.mouseIsDown = true;
    var counter = 0;
    var quantity = this.spawnQuantity;
    var intervalId = setInterval(function() {
      if (this.mouseIsDown) {
        if (counter === 1) {
          quantity = 1;
        }
        for (var i = 0; i < quantity; i++) {
          if (this.interactionParticle) {
            this.particles.push(new Particle(this, this.interactionParticle.x, this.interactionParticle.y));
          }
        }
      } else {
        clearInterval(intervalId);
      }
      counter++;
    }.bind(this), 50);
  }.bind(this);

  this.onTouchStart = function(e) {
    e.preventDefault();
    setTimeout(function() {
      if (!this.touchIsMoving) {
        for (var i = 0; i < this.spawnQuantity; i++) {
          this.particles.push(new Particle(this, e.changedTouches[0].clientX, e.changedTouches[0].clientY));
        }
      }
    }.bind(this), 200);
  }.bind(this);

  this.onMouseUp = function(e) {
    this.mouseIsDown = false;
  }.bind(this);

  this.onMouseOut = function(e) {
    this.removeInteractionParticle();
  }.bind(this);

  this.onTouchEnd = function(e) {
    e.preventDefault();
    this.touchIsMoving = false;
    this.removeInteractionParticle();
  }.bind(this);

  this.canvas.addEventListener('mousemove', this.onMouseMove);
  this.canvas.addEventListener('touchmove', this.onTouchMove);
  this.canvas.addEventListener('mousedown', this.onMouseDown);
  this.canvas.addEventListener('touchstart', this.onTouchStart);
  this.canvas.addEventListener('mouseup', this.onMouseUp);
  this.canvas.addEventListener('mouseout', this.onMouseOut);
  this.canvas.addEventListener('touchend', this.onTouchEnd);
};

ParticleNetwork.prototype.unbindUiActions = function() {
  if (this.canvas) {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('touchmove', this.onTouchMove);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('mouseout', this.onMouseOut);
    this.canvas.removeEventListener('touchend', this.onTouchEnd);
  }
};

ParticleNetwork.prototype.write = function(text, posX, posY, size, spacing, lineDistance) {
  var self = this;
  var x_scale, y_scale, x_offset, y_offset, delay, letter_spacing;
  x_scale = size;
  y_scale = size;
  x_offset = posX;
  y_offset = posY;
  letter_spacing = spacing;
  delay = 2;
  
  var add = function(x, y, delay, text) {
    var particle = new Particle(self, x, y);
    particle.velocity = {
      x: 0,
      y: 0
    };
    //if (size > 10)
    particle.radius += size/10-1;
    particle.netLineDistance = lineDistance;
    particle.blendingSpeed = 0.005;
    console.log(particle);
    particle.setFadeIn(2, delay);
    particle.text = text;
    self.particles.push(particle);
  }
  var letters = {};
  // Letters
  // Points in fadeIn order
  letters.A = [
    [0, 20],
    [1, 16.67],
    [2, 13.33],
    [2+4/3, 13.33-4.44],
    [2+8/3, 13.33],
    [2+8/3, 13.33-8.88],
    [6, 0],
    [2+2*8/3, 13.33],
    [7.5, 5],
    [9, 10],
    [10, 13.33],
    [11, 16.67],
    [12, 20]
  ];
  letters.B = [
    [0, 0],
    [0, 2.5],
    [0, 5],
    [0, 7.5],
    [0, 10],
    [0, 12.5],
    [0, 15],
    [0, 17.5],
    [0, 20],
    [2.5, 0],
    [2.5, 20],
    [5, 0],
    [5, 20],
    [7, 0.8],
    [7, 19.2],
    [7.6, 9],
    [7.6, 11],
    [8.6, 2.6],
    [8.6, 7.4],
    [8.6, 12.6],
    [8.6, 17.4],
    [9.2, 5],
    [9.2, 15],
    [2, 10],
    [4, 10],
    [6, 10]
  ];
  letters.D = [
    [0, 0],
    [0, 2.5],
    [0, 5],
    [0, 7.5],
    [0, 10],
    [0, 12.5],
    [0, 15],
    [0, 17.5],
    [0, 20],
    [2.5, 0],
    [2.5, 20],
    [5.4, 0.2],
    [5.4, 19.8],
    [8, 1.5],
    [8, 18.5],
    [9.5, 5],
    [9.5, 15],
    [10, 8],
    [10, 12]
  ];
  letters.G = [
    [0, 7],
    [0, 4.5],
    [0.4, 2],
    [2, 0.6],
    [5, 0],
    [7.8, 0.2],
    [9.8, 1.6],
    [10.4, 4.4],
    [0, 10],
    [0, 13],
    [0, 15.5],
    [0.4, 18],
    [2, 19.4],
    [5, 20],
    [8, 20],
    [9.8, 19],
    [10.4, 17],
    [10.4, 14.5],
    [10.4, 12],
    [9, 12],
    [7, 12],
    [5, 12]
  ];
  letters.I = [
    [0, 0],
    [0, 2],
    [0, 4],
    [0, 6],
    [0, 8],
    [0, 10],
    [0, 12],
    [0, 14],
    [0, 16],
    [0, 18],
    [0, 20],
  ];
  letters.T = [
    [0, 0],
    [4, 0],
    [8, 0],
    [12, 0],
    [16, 0],
    [8, 4],
    [8, 8],
    [8, 12],
    [8, 16],
    [8, 20]
  ];

  // Add Text
  for (var i = 0; i < text.length; i++) {
    // If letter available
    if (letters.hasOwnProperty(text[i])) {
      var letter = letters[text[i]];
      console.log(letter);
      var letter_offset = x_offset + letter_spacing;
      if (text[i] === "A" && text[i-1] === "D")
        letter_offset -= 30;
      else if (text[i] === "T")
        letter_offset -= 60;
      else if (text[i] === "A" && text[i-1] === "T")
        letter_offset -= 60;
      for (var j = 0; j < letter.length; j++) {
        var x = letter_offset + letter[j][0]*x_scale;
        var y = letter[j][1]*y_scale+y_offset;
        delay += 0.1;
        // Add Particle
        add(x, y, delay, text[i]);
        
        if (x > x_offset)
          x_offset = x;
        console.log(x + " | " + y);
      }
    }
    else if (text[i] === " ")
      x_offset += 40;
  }
  console.log("Write " + text);
};

var getLimitedRandom = function(min, max, roundToInteger) {
  var number = Math.random() * (max - min) + min;
  if (roundToInteger) {
    number = Math.round(number);
  }
  return number;
};

var returnRandomArrayitem = function(array) {
  return array[Math.floor(Math.random() * array.length)];
};

pna = new ParticleNetworkAnimation();
pna.init($('.particle-network-animation')[0]);