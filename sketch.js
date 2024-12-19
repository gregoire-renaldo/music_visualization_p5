var song
var fft
var particles = []

function preload() {
  // Load a sound file
  song = loadSound('assets/19.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(400, 400);
  angleMode(DEGREES)
  fft = new p5.FFT();
}

function draw() {
  background(0)
  stroke(255)
  strokeWeight(2)
  noFill()
  
  // put circle in the middle of the canvas
  translate(width / 2, height / 2)

  // link particles to sound
  // getEnergy If a second frequency is given, will return average amount of energy that exists between the two frequencies.
    // Returns the amount of energy (volume) at a specific frequency, or the average amount of energy between two frequencies. 
    // Accepts Number(s) corresponding to frequency (in Hz), or a String corresponding to predefined frequency ranges ("bass", "lowMid", "mid", "highMid", "treble"). 
    // Returns a range between 0 (no energy/volume at that frequency) and 255 (maximum energy). NOTE: analyze() must be called prior to getEnergy(). 
    // Analyze() tells the FFT to analyze frequency data, and getEnergy() uses the results determine the value at a specific frequency or range of frequencies.
  fft.analyze()
  amp = fft.getEnergy(20, 200)

  var wave = fft.waveform()

  // loop to do 2 half circles, one the right with posive sin, one the left with negative sin
  for(var t = -1; t <= 1; t += 2) {
  // beginShape() endShape to link points
  beginShape()
  // more complex form if i is incrementing by 0.5
  for (var i = 0; i <= 180; i+= 1) {
    var index = floor(map(i, 0, 180, 0, wave.length - 1))
    
    // radius of circle map(wave[index], -1, 1, minRadiusCircle, maxRadiusCircle)
    var r = map(wave[index], -1, 1, 150, 350)
    
    // var x = i
    // var y = wave[index] *300 + height/2
    var x = r * sin(i) * t
    var y = r * cos(i)
    vertex(x, y)
  }
  endShape()
  }

  // create a particle at each frame
  var p = new Particle()
  particles.push(p)

  // to see the particles on the canvas, use show method on particles
  // for (var i = 0; i < particles.length; i++) {
  // go backwards to prevent flicker effect
  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
    // (amp > 230) is a condition
      particles[i].update(amp > 181)
      particles[i].show()
    } else {
      particles.splice(i, 1)
    }
  }
}


function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  } else {
    song.play();
    loop()
  }
}

class Particle {
  constructor() {
    // position of the particle
    this.pos = p5.Vector.random2D().mult(250)
    // we want particles to move, so they need velocity and acceleration
    this.vel = createVector(0, 0)
    // 
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    // randomize size por particle
    this.w = random(3, 5)
    this.color = [random(180, 255), random(180, 255), random(180, 255)]
  }

  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    // this.acc.mult(0)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  
  // edges method to remove particle when it's out of the canvas
  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true
    } else {
      return false
    }
  }

  show() {
    noStroke(255)
    // TO DO change the color depending of the wave value
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, 4)
  }
}