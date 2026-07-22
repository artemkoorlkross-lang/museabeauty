const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');
const menuButton = document.querySelector('.menu-btn');
const toTop = document.querySelector('.to-top');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScroll() {
  nav.classList.toggle('scrolled', scrollY > 30);
  toTop.classList.toggle('show', scrollY > innerHeight);
  if (!reducedMotion) document.querySelector('.hero-bg').style.transform = `translate3d(0,${scrollY * .1}px,0)`;
}
addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  document.body.style.overflow = open ? 'hidden' : '';
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open'); menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
}));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const el = entry.target, target = Number(el.dataset.count), start = performance.now();
  const tick = now => { const p = Math.min((now - start) / 1200, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
  reducedMotion ? el.textContent = target : requestAnimationFrame(tick); countObserver.unobserve(el);
}), { threshold: .5 });
counters.forEach(el => countObserver.observe(el));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
  const image = button.querySelector('img'); lightboxImage.src = image.src; lightboxImage.alt = image.alt; lightbox.showModal();
}));
lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

const compare = document.querySelector('.compare');
compare.querySelector('input').addEventListener('input', event => compare.style.setProperty('--pos', `${event.target.value}%`));

const reviews = [...document.querySelectorAll('.review-stage article')];
const reviewProgress = document.querySelector('.review-nav i');
let activeReview = 0, reviewTimer;
function showReview(index) {
  activeReview = (index + reviews.length) % reviews.length;
  reviews.forEach((review, i) => review.classList.toggle('active', i === activeReview));
  reviewProgress.style.width = `${(activeReview + 1) / reviews.length * 100}%`;
}
function restartReviews() { clearInterval(reviewTimer); if (!reducedMotion) reviewTimer = setInterval(() => showReview(activeReview + 1), 6500); }
document.querySelector('[data-prev]').addEventListener('click', () => { showReview(activeReview - 1); restartReviews(); });
document.querySelector('[data-next]').addEventListener('click', () => { showReview(activeReview + 1); restartReviews(); });
showReview(0); restartReviews();

const dateInput = document.querySelector('input[type="date"]');
dateInput.min = new Date().toISOString().split('T')[0];
const bookingForm = document.querySelector('.booking-form');
const toast = document.querySelector('.toast');
let toastTimer;
function showToast(title, message) {
  toast.querySelector('span').innerHTML = `${title}<small>${message}</small>`;
  toast.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}
document.querySelectorAll('[data-demo-link]').forEach(button => button.addEventListener('click', () => {
  const isBooksy = button.dataset.demoLink === 'booksy';
  showToast(
    isBooksy ? 'Przykładowa integracja Booksy' : 'Przykładowa lokalizacja',
    isBooksy ? 'W prawdziwej wersji ten przycisk otworzy profil salonu w Booksy.' : 'W prawdziwej wersji ten przycisk otworzy dokładną trasę do salonu.'
  );
}));
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!bookingForm.checkValidity()) { bookingForm.reportValidity(); return; }
  bookingForm.reset(); dateInput.min = new Date().toISOString().split('T')[0];
  showToast('Dziękujemy!', 'Formularz demonstracyjny został wysłany.');
});
