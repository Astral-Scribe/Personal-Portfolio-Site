// Gallery carousel — one image visible at a time, prev/next buttons,
// clickable dot indicators, and left/right arrow key + swipe support.

document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("carouselTrack");
    const dotsContainer = document.getElementById("carouselDots");
    const slides = track ? Array.from(track.children) : [];

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    // Build one dot per slide
    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length; // wraps around both directions
        updateCarousel();
    }

    window.nextSlide = () => goToSlide(currentIndex + 1);
    window.prevSlide = () => goToSlide(currentIndex - 1);

    // Keyboard navigation
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") nextSlide();
        if (event.key === "ArrowLeft") prevSlide();
    });

    // Basic touch swipe support
    let touchStartX = 0;
    track.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
    });
    track.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) > 40) { // ignore tiny accidental swipes
            if (delta < 0) nextSlide();
            else prevSlide();
        }
    });

    updateCarousel();
});
