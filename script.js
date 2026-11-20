/* 1. HEADER + TO-TOP */
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
function onScroll(){
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  toTop.classList.toggle('show', y > 600);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* 2. MOBIILIVALIKKO */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && document.body.classList.contains('menu-open')){
    document.body.classList.remove('menu-open');
    navToggle.classList.remove('active');
  }
});

/* 3. REVEAL */
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if(e.isIntersecting){
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* 4. COUNTERS */
function animateCounter(el){
  const target = parseFloat(el.dataset.count);
  const dec = (el.dataset.count.split('.')[1] || '').length;
  const suffix = el.dataset.suffix || '';
  const duration = 1700;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(dec).replace('.', ',') + suffix;
    if(p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(dec).replace('.', ',') + suffix;
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('[data-count]');
if('IntersectionObserver' in window){
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ animateCounter(e.target); co.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => co.observe(c));
}

/* 5. MENU TABS */
document.querySelectorAll('.menu__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.menu__tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu__panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

/* 6. TESTIMONIAL SLIDER */
(function initSlider(){
  const track = document.getElementById('sliderTrack');
  const dotsBox = document.getElementById('sliderDots');
  if(!track) return;
  const slides = Array.from(track.children);
  const total = slides.length;
  let index = 0, autoplay;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', `Arvostelu ${i + 1}`);
    if(i === 0) d.classList.add('active');
    d.addEventListener('click', () => { goTo(i); restart(); });
    dotsBox.appendChild(d);
  });
  const dots = Array.from(dotsBox.children);

  function goTo(i){
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle('active', k === index));
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }
  document.getElementById('nextBtn').addEventListener('click', () => { next(); restart(); });
  document.getElementById('prevBtn').addEventListener('click', () => { prev(); restart(); });
  function start(){ autoplay = setInterval(next, 6500); }
  function stop(){ clearInterval(autoplay); }
  function restart(){ stop(); start(); }
  const slider = document.getElementById('slider');
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  start();
})();

/* 7. OPEN STATUS */
(function initStatus(){
  const status = document.getElementById('status');
  if(!status) return;
  const txt = status.querySelector('.status__text');
  function check(){
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 6=Sat
    const hour = now.getHours() + now.getMinutes() / 60;
    let open = false, closeTime = '';
    if(day >= 1 && day <= 4){ open = hour >= 11 && hour < 22; closeTime = '22:00'; }
    else if(day === 5 || day === 6){ open = hour >= 11 && hour < 23; closeTime = '23:00'; }
    else if(day === 0){ open = hour >= 12 && hour < 21; closeTime = '21:00'; }
    status.classList.remove('status--open', 'status--closed');
    if(open){
      status.classList.add('status--open');
      txt.textContent = `Avoinna nyt — suljemme klo ${closeTime}`;
    } else {
      status.classList.add('status--closed');
      txt.textContent = 'Suljettu nyt';
    }
  }
  check();
  setInterval(check, 60000);
})();

/* 8. RESERVATION FORM */
const form = document.getElementById('reservationForm');
const success = document.getElementById('formSuccess');
function setErr(f, has){ f.closest('.field').classList.toggle('error', has); }

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('rname');
  const phone = document.getElementById('rphone');
  const date = document.getElementById('rdate');
  const time = document.getElementById('rtime');
  const guests = document.getElementById('rguests');
  let valid = true;

  if(name.value.trim().length < 2){ setErr(name, true); valid = false; } else setErr(name, false);
  const pc = phone.value.replace(/[\s\-()]/g, '');
  if(!/^(\+358|0)\d{6,10}$/.test(pc)){ setErr(phone, true); valid = false; } else setErr(phone, false);
  if(!date.value){ setErr(date, true); valid = false; } else setErr(date, false);
  if(!time.value){ setErr(time, true); valid = false; } else setErr(time, false);
  if(!guests.value){ setErr(guests, true); valid = false; } else setErr(guests, false);

  if(!valid){ form.querySelector('.field.error input, .field.error select')?.focus(); return; }

  const btn = form.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = 'Lähetetään…';
  setTimeout(() => {
    btn.disabled = false; btn.innerHTML = orig;
    success.classList.add('show');
    form.reset();
    success.scrollIntoView({behavior:'smooth', block:'center'});
    setTimeout(() => success.classList.remove('show'), 9000);
  }, 1100);
});
form.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => setErr(el, false));
  el.addEventListener('change', () => setErr(el, false));
});

/* 9. TO-TOP + YEAR */
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('year').textContent = new Date().getFullYear();

/* 10. HERO VIDEO */
const heroVideo = document.querySelector('.hero__video');
if(heroVideo){
  heroVideo.play().catch(() => {});
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
  }
}