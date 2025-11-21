/* script.js
   Slideshow + simple contact form behaviour.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Slideshow setup
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsContainer = document.getElementById('dots');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let current = 0;
  let autoplay = true;
  let intervalId = null;
  const AUTOPLAY_MS = 5000;

  function goTo(idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    // dots active
    Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;
  }

  // create dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => { stopAutoplay(); goTo(i); });
    dotsContainer.appendChild(btn);
  });

  prevBtn.addEventListener('click', () => { stopAutoplay(); goTo((current - 1 + slides.length) % slides.length); });
  nextBtn.addEventListener('click', () => { stopAutoplay(); goTo((current + 1) % slides.length); });

  function startAutoplay() {
    intervalId = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; autoplay = false; }
  }

  // pause on hover
  const slideshowEl = document.getElementById('slideshow');
  slideshowEl.addEventListener('mouseenter', () => { stopAutoplay(); });
  slideshowEl.addEventListener('mouseleave', () => { if (!intervalId && autoplay) startAutoplay(); });

  // initialize
  goTo(0);
  startAutoplay();

  // Contact form: in-demo behaviour (prevent page reload). Replace with ajax or server endpoint.
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    // Basic validation demo
    const name = fd.get('name').trim(), email = fd.get('email').trim(), msg = fd.get('message').trim();
    if (!name || !email || !msg) {
      alert('Please fill all required fields.');
      return;
    }

    // For demo: open mail client with prefilled content (simple fallback)
    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nPhone: ${fd.get('phone')}\n\nMessage:\n${msg}`);
    window.location.href = `mailto:zamir@gosolar.com.pk?subject=${subject}&body=${body}`;

    // Note: for production, submit the form to your backend or use an email service (SendGrid/Mailgun)
  });

  // touch support: swipe to change slides
  let startX = 0;
  slideshowEl.addEventListener('touchstart', (ev) => { startX = ev.touches[0].clientX; });
  slideshowEl.addEventListener('touchend', (ev) => {
    const endX = ev.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 50) {
      stopAutoplay();
      if (diff < 0) goTo((current + 1) % slides.length);
      else goTo((current - 1 + slides.length) % slides.length);
    }
  });

});
