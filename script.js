// Image Configuration
const imageUrls = [
    "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/d423edda348d766ff3d556237d0fc6acbf489d88/craiyon_003148_image.png",
    "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20251222_194522_174.jpg",
    "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20251222_194153_156.jpg",
    "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20260113_174807_582.jpg",
    "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20251222_201602_967.jpg",
    "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20251222_201041_498.jpg",
    "https://raw.githubusercontent.com/kirbypaladan24-lgtm/Images-/9bb4a4a68a66d65c73329d3df1847962205ddb68/IMG_20260113_175301_371.jpg"
];

// Selectors
const track = document.getElementById('track');
const viewport = document.getElementById('viewport');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

// State Variables
let currentTranslate = 0;
let isDragging = false;
let isHovered = false;
let startPos = 0;
let autoScrollSpeed = -0.8; 
let velocity = 0;

// 1. Initialize Cards
function init() {
    const cardHTML = imageUrls.map(url => `
        <div class="card" onclick="handleCardClick(event, '${url}')">
            <img src="${url}" alt="Carousel Image">
        </div>
    `).join('');
    
    // Double content for infinite effect
    track.innerHTML = cardHTML + cardHTML;

    // Attach hover listeners for movement pausing
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => isHovered = true);
        card.addEventListener('mouseleave', () => isHovered = false);
    });

    requestAnimationFrame(animate);
}

// 2. Animation Loop
function animate() {
    if (!isDragging && !isHovered) {
        currentTranslate += (autoScrollSpeed + velocity);
        velocity *= 0.95; // Decay momentum

        const halfWidth = track.offsetWidth / 2;
        if (currentTranslate <= -halfWidth) currentTranslate += halfWidth;
        if (currentTranslate > 0) currentTranslate -= halfWidth;
    } else if (isDragging) {
        // Still apply infinite reset while dragging
        const halfWidth = track.offsetWidth / 2;
        if (currentTranslate <= -halfWidth) currentTranslate += halfWidth;
        if (currentTranslate > 0) currentTranslate -= halfWidth;
    }
    
    track.style.transform = `translateX(${currentTranslate}px)`;
    requestAnimationFrame(animate);
}

// 3. Desktop & Mobile Swipe Logic
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

function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

// 4. Lightbox Logic
function handleCardClick(e, url) {
    if (Math.abs(velocity) < 2) {
        lightboxImg.src = url;
        lightbox.classList.add('active');
        autoScrollSpeed = 0;
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    autoScrollSpeed = -0.8;
}

closeBtn.onclick = closeLightbox;
lightbox.onclick = (e) => { if (e.target !== lightboxImg) closeLightbox(); };
document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeLightbox(); });

// Run Init
init();
