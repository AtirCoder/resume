const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('#menu');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menu.hidden = open; menuButton.setAttribute('aria-expanded', String(!open)); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !menuButton.contains(e.target)) closeMenu(); });
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
function openProject(hash, focus = false) { if (!hash.startsWith('#project-')) return; const detail = document.getElementById(hash.slice(1)); if (detail?.tagName === 'DETAILS') { detail.open = true; if (focus) detail.querySelector('summary').focus({ preventScroll: true }); } }
document.querySelectorAll('.project-cover').forEach(a => a.addEventListener('click', () => openProject(a.hash, true)));
window.addEventListener('hashchange', () => openProject(location.hash));
openProject(location.hash);
