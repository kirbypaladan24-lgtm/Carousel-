const cardData = [
{
url: "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/d423edda348d766ff3d556237d0fc6acbf489d88/craiyon_003148_image.png",
title: "Paladan, Kirby H.",
desc: "AI Generated Concept."
},
{
url: "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20251222_194522_174.jpg",
title: "Paladan, Kirby H.",
desc: "Bright lights, chill nights."
},
{
url: "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20251222_194153_156.jpg",
title: "Paladan, Kirby H.",
desc: "Blue hour vibes."
},
{
url: "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20260113_174807_582.jpg",
title: "Paladan, Kirby H.",
desc: "Peace and quiet."
},
{
url: "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20251222_201602_967.jpg",
title: "Paladan, Kirby H.",
desc: "Ending the day right."
},
{
url: "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20251222_201041_498.jpg",
title: "Paladan, Kirby H.",
desc: "Golden hour glow."
},
{
url: "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20260113_175301_371.jpg",
title: "Paladan, Kirby H.",
desc: "Cool breeze, clear mind."
}
];

const track = document.getElementById('track');
const viewport = document.getElementById('viewport');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

const cardWidth = 220;
const cardGap = 20; 
const totalItemWidth = cardWidth + cardGap;
const totalCards = cardData.length * 2; 

let currentTranslate = 0;
let isDragging = false;
let isHovered = false;
let startPos = 0;
let autoScrollSpeed = -0.5; 
let velocity = 0;
let lastActiveIndex = -1; 
let cachedWindowWidth = window.innerWidth;
let currentEffectiveSpeed = 0;

function init() {
const cardHTML = cardData.map((data, index) => `
<div class="card" data-index="${index}" onclick="handleCardClick(event, ${index})">
<div class="card-inner">
<img src="${data.url}" alt="${data.title}" loading="lazy">
<div class="card-overlay">
<div class="card-title">${data.title}</div>
<div class="card-desc">${data.desc}</div>
</div>
</div>
</div>
`).join('');

track.innerHTML = cardHTML + cardHTML;

const cards = document.querySelectorAll('.card');
cards.forEach(card => {
card.addEventListener('mouseenter', () => isHovered = true);
card.addEventListener('mouseleave', () => isHovered = false);
});

window.addEventListener('resize', () => { 
cachedWindowWidth = window.innerWidth; 
resizeCanvas(); 
});

initDust(); 
requestAnimationFrame(animate);
}

function updateActiveCard() {
const centerPoint = (cachedWindowWidth / 2) - currentTranslate - (cardWidth / 2);
let index = Math.round(centerPoint / totalItemWidth);

if (index < 0) index = 0;
if (index >= totalCards) index = totalCards - 1;

if (index !== lastActiveIndex) {
const cards = document.querySelectorAll('.card');
if (lastActiveIndex >= 0 && cards[lastActiveIndex]) {
cards[lastActiveIndex].classList.remove('active-card');
}
if (cards[index]) {
cards[index].classList.add('active-card');
}
lastActiveIndex = index;
}
}

function animate() {
let targetSpeed = (isHovered || isDragging) ? 0 : autoScrollSpeed;
currentEffectiveSpeed += (targetSpeed - currentEffectiveSpeed) * 0.05;

if (!isDragging) {
currentTranslate += (currentEffectiveSpeed + velocity);
velocity *= 0.95; 
}

const halfWidth = (cardData.length * totalItemWidth);
if (currentTranslate <= -halfWidth) {
currentTranslate += halfWidth;
resetActiveIndexOnJump(halfWidth);
}
else if (currentTranslate > 0) {
currentTranslate -= halfWidth;
resetActiveIndexOnJump(-halfWidth);
}

track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
updateActiveCard();
requestAnimationFrame(animate);
}

function resetActiveIndexOnJump(offset) {
const cardsCount = cardData.length;
if (offset > 0) lastActiveIndex -= cardsCount; 
else lastActiveIndex += cardsCount;

const cards = document.querySelectorAll('.card');
cards.forEach(c => c.classList.remove('active-card'));
if (cards[lastActiveIndex]) cards[lastActiveIndex].classList.add('active-card');
}


viewport.addEventListener('mousedown', dragStart);
viewport.addEventListener('touchstart', dragStart, {passive: true});
window.addEventListener('mousemove', dragMove);
window.addEventListener('touchmove', (e) => {
if(isDragging) e.preventDefault();
dragMove(e);
}, {passive: false});
window.addEventListener('mouseup', dragEnd);
window.addEventListener('touchend', dragEnd);

function dragStart(e) {
isDragging = true;
startPos = getPositionX(e);
velocity = 0;
currentEffectiveSpeed = 0; 
}

function dragMove(e) {
if (!isDragging) return;
const currentPosition = getPositionX(e);
const diff = currentPosition - startPos;
currentTranslate += diff;
velocity = diff;
startPos = currentPosition;
}

function dragEnd() { isDragging = false; }
function getPositionX(e) { return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX; }


function handleCardClick(e, index) {
if (Math.abs(velocity) < 2) {
const data = cardData[index];
lightboxImg.src = data.url;
document.getElementById('lightbox-title').innerText = data.title;
document.getElementById('lightbox-desc').innerText = data.desc;
lightbox.classList.add('active');
currentEffectiveSpeed = 0; 
}
}

function closeLightbox() {
lightbox.classList.remove('active');
}

closeBtn.onclick = closeLightbox;
lightbox.onclick = (e) => { if (e.target !== lightboxImg) closeLightbox(); };
document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeLightbox(); });


const canvas = document.getElementById('dust-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 250; 

function resizeCanvas() {
canvas.width = 600; 
canvas.height = window.innerHeight;
}

class Particle {
constructor() {
this.reset(true);
}

reset(initial = false) {
this.x = Math.random() * canvas.width;

const spawnFloor = canvas.height * 0.50; 

this.y = initial ? Math.random() * spawnFloor : spawnFloor + Math.random() * 20;

this.speed = 0.2 + Math.random() * 0.2; 
this.size = 0.2 + Math.random() * 1.0; 
this.opacity = 0.1 + Math.random() * 0.5;
}

update() {
this.y -= this.speed;
if (this.y < -10) {
this.reset(false);
}
}

draw() {
ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
ctx.beginPath();
ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
ctx.fill();
}
}

function initDust() {
resizeCanvas();
for (let i = 0; i < particleCount; i++) {
particles.push(new Particle());
}
animateDust();
}

function animateDust() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
particles.forEach(p => {
p.update();
p.draw();
});
requestAnimationFrame(animateDust);
}

init();
