"use strict";
window.addEventListener("load",function() {
  const initSpeed = 1;
  const rMin = 1;
  const rMax = 10;
  let canv, ctx;   
  let maxx, maxy; 
  let particles;
  let click;
  let initDir;
  let noiseInitDir;
  let mouse = {x: 0, y: 0};
  let org = {x: 0, y: 0};
  let mouseMoved = false;
  let hue;
  const mrandom = Math.random;
  const mfloor = Math.floor;
  const mround = Math.round;
  const mceil = Math.ceil;
  const mabs = Math.abs;
  const mmin = Math.min;
  const mmax = Math.max;
  const mPI = Math.PI;
  const mPIS2 = Math.PI / 2;
  const m2PI = Math.PI * 2;
  const msin = Math.sin;
  const mcos = Math.cos;
  const matan2 = Math.atan2;
  const mhypot = Math.hypot;
  const msqrt = Math.sqrt;
  const rac3   = msqrt(3);
  const rac3s2 = rac3 / 2;
  const mPIS3 = Math.PI / 3;
  function alea (min, max) {
    if (typeof max == 'undefined') return min * mrandom();
    return min + (max - min) * mrandom();
  }
  function intAlea (min, max) {
    if (typeof max == 'undefined') {
      max = min; min = 0;
    }
    return mfloor(min + (max - min) * mrandom());
  } 
  function NoiseGen(rndFunc, period, nbHarmonics, attenHarmonics, lowValue = 0, highValue = 1) {
  let arP0 = [];  
  let arP1 = []; 
  let amplitudes = []; 
  let increments = []; 
  let phases = [];
  let globAmplitude = 0;
  if (!rndFunc) rndFunc = Math.random;
  if (nbHarmonics < 1) nbHarmonics = 1;
  for (let kh = 1; kh <= nbHarmonics; ++ kh) {
    arP0[kh] = rndFunc();
    arP1[kh] = rndFunc();
    amplitudes[kh] = (kh == 1) ? 1 : (amplitudes[kh - 1] * attenHarmonics);
    globAmplitude += amplitudes[kh];
    increments[kh] = kh / period;
    phases[kh] = rndFunc();
  } 
  amplitudes.forEach ((value, kh) => amplitudes[kh] = value / globAmplitude * (highValue - lowValue))
  return function () {
    let pf, pfl;
    let signal = 0;
    for (let kh = nbHarmonics; kh >= 1; --kh) {
      pf = phases[kh] += increments[kh];
      if (phases[kh] >= 1) {
        pf = phases[kh] -= 1;
        arP0[kh] = arP1[kh];
        arP1[kh] = rndFunc();
      } 
      pfl = pf * pf * (3 - 2 * pf); 
      signal += (arP0[kh] * (1 - pfl) + arP1[kh] * pfl) * amplitudes[kh];
    } 
    return signal + lowValue;
  } 
  } 
  function intermediate (p0, p1, alpha) {
    return [(1 - alpha) * p0[0] + alpha * p1[0],
            (1 - alpha) * p0[1] + alpha * p1[1]];
  } 

  function distance (p0, p1) {
    return mhypot (p0[0] - p1[0], p0[1] - p1[1]);
  } 
  function randomElement(array) {
    return array[intAlea(array.length)];
  }
  function removeElement(array, element) {
    let idx = array.indexOf(element);
    if (idx == -1) throw ('Bug ! indexOf -1 in removeElement');
    array.splice(idx, 1);
  } 
function clonePoint(p) {
  return [p[0],p[1]];
}
function Particle () {
  this.x = org.x;
  this.y = org.y;
  this.dir = alea(m2PI);
  this.speed = initSpeed * alea(0.8, 1.4);
  this.genddir = NoiseGen(null, 100, 2, 0.8, -0.03, 0.03);
  this.r = rMin;
  this.color1 = `hsl(${hue}, 100%, ${alea(20,80)}%)`;
  hue = (hue + intAlea( -5, 5)) % 360;
} 
Particle.prototype.move = function () {
  this.dir = (this.dir + this.genddir()) % m2PI;
  this.speed += 0.01;
  this.r = mmin(this.r + 0.1,  rMax);
  this.x += this.speed * mcos(this.dir);
  this.y += this.speed * msin(this.dir);
  if (this.y < -this.r || this.y > maxy + this.r || this.x < -this.r || this.x > maxx + this.r) return false;
  return true;
} 
Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y,this.r,0,m2PI);
  ctx.fillStyle = this.color1;
  ctx.fill();
} 
function startOver() {
  maxx = window.innerWidth;
  maxy = window.innerHeight;
  if (maxx < 10) return false;
  canv.style.left = ((window.innerWidth ) - maxx) / 2 + 'px';
  canv.style.top = ((window.innerHeight ) - maxy) / 2 + 'px';
  ctx.canvas.width = maxx;
  ctx.canvas.height = maxy;
  ctx.lineJoin = 'round';  
  noiseInitDir = NoiseGen(null, 200,0,0,-0.03,0.03);
  hue = intAlea(360);
  if (org.x == 0 && org.y == 0)
    org = {x: maxx / 2, y: maxy / 2};
  mouse = {x: maxx / 2, y: maxy / 2};
  particles = [];
  initDir = alea(m2PI);
  return true; 
} 
function mouseMove(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouseMoved = true;
} 
function mouseClick() {
  org.x = event.clientX;
  org.y = event.clientY;
  click = true;
} 
let animate;
{ 
let still = 0;
let tStampPre = 0;
animate = function (tStamp) {
  if (tStampPre == 0) tStampPre = tStamp;
  if (click && startOver()) click = false;
  if (particles) {
    if (mouseMoved) {
      still = 1000; 
      mouseMoved = false;
    }
    if (still > 0) {
      still += tStampPre - tStamp;
      if (still <= 0) {
      }
    }
    tStampPre = tStamp;
    initDir += noiseInitDir();
    initDir %= m2PI;
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    ctx.fillRect(0, 0, maxx, maxy);
    if (particles.length < 300) {
      particles.push(new Particle());
    }
    particles.forEach((part,k) => {
      if (part.move() == false ) {
        removeElement(particles, part);
      } else part.draw();
    });
  }
  window.requestAnimationFrame(animate);
} 
} 
  {
    canv = document.createElement('canvas');
    canv.style.position="absolute";
    document.body.appendChild(canv);
    ctx = canv.getContext('2d');
  } 
  window.addEventListener('click',mouseClick);
  window.requestAnimationFrame(animate);
  canv.addEventListener('mousemove',mouseMove);
  click = true;
}); 
