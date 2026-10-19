const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.site-menu');
const header = document.querySelector('.site-header');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

const year = document.getElementById('current-year');
if (year) year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 12));

// Transparent herb crops are optional. They appear only after a valid local image has loaded.
document.querySelectorAll('.herb-object img').forEach((image) => {
  const reveal = () => image.parentElement.classList.add('is-loaded');
  if (image.complete && image.naturalWidth > 0) reveal();
  image.addEventListener('load', reveal, { once: true });
});

// Office markers support hover, keyboard focus and tap/click on touch screens.
const officeLocations = [...document.querySelectorAll('[data-location]')];
const closeOfficeLocations = (except = null) => {
  officeLocations.forEach((location) => {
    if (location === except) return;
    location.classList.remove('is-open');
    location.querySelector('.location-marker')?.setAttribute('aria-expanded', 'false');
  });
};

officeLocations.forEach((location) => {
  const marker = location.querySelector('.location-marker');
  const closeButton = location.querySelector('.location-close');
  location.addEventListener('focusin', (event) => {
    if (!event.target.matches(':focus-visible')) return;
    closeOfficeLocations(location);
    location.classList.add('is-open');
    marker?.setAttribute('aria-expanded', 'true');
  });
  location.addEventListener('focusout', (event) => {
    if (location.contains(event.relatedTarget)) return;
    location.classList.remove('is-open');
    marker?.setAttribute('aria-expanded', 'false');
  });
  marker?.addEventListener('click', (event) => {
    const isKeyboardActivation = event.detail === 0;
    const willOpen = isKeyboardActivation
      ? (marker.matches(':focus-visible') || !location.classList.contains('is-open'))
      : !location.classList.contains('is-open');
    closeOfficeLocations(location);
    location.classList.toggle('is-open', willOpen);
    marker.setAttribute('aria-expanded', String(willOpen));
  });
  closeButton?.addEventListener('click', () => {
    location.classList.remove('is-open');
    marker?.setAttribute('aria-expanded', 'false');
    document.getElementById('footprint-title')?.focus({ preventScroll: true });
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-location]')) {
    closeOfficeLocations();
    const focusedLocation = document.activeElement?.closest('[data-location]');
    if (focusedLocation) document.activeElement.blur();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeOfficeLocations();
    const focusedLocation = document.activeElement?.closest('[data-location]');
    if (focusedLocation) document.activeElement.blur();
  }
});
