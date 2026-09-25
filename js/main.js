// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav border on scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu toggle
const toggle = nav.querySelector('.nav-toggle');
const setMenu = (open) => {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Highlight the nav link for the section in view
const links = [...document.querySelectorAll('.nav-links a')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach((s) => observer.observe(s));

// Floating WhatsApp button: show once the hero is scrolled past, hide at the contact section
const waFloat = document.querySelector('.wa-float');
const inView = { hero: true, contact: false };
const waObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { inView[entry.target.id === 'contact' ? 'contact' : 'hero'] = entry.isIntersecting; });
  waFloat.classList.toggle('show', !inView.hero && !inView.contact);
});
waObserver.observe(document.querySelector('.hero'));
waObserver.observe(document.getElementById('contact'));

// Contact form: submit to Formspree without leaving the page.
// Without JS the form still posts normally.
const form = document.getElementById('contact-form');
const status = form.querySelector('.form-status');
const button = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  button.disabled = true;
  status.className = 'form-status';
  status.textContent = 'Sending…';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    form.reset();
    status.classList.add('ok');
    status.textContent = "Thanks, your message is on its way. I'll reply soon.";
  } catch {
    status.classList.add('err');
    status.textContent = 'Something went wrong. Please email me at ulaghaondo@gmail.com or message me on WhatsApp at +234 708 642 8550 instead.';
  } finally {
    button.disabled = false;
  }
});
