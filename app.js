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
const pattern = document.querySelector('#vase-pattern');
for (let i=0;i<16;i++) { const ellipse=document.createElementNS('http://www.w3.org/2000/svg','ellipse'); ellipse.setAttribute('cx','250'); ellipse.setAttribute('cy', String(103+i*13)); ellipse.setAttribute('rx', String(40+Math.max(0, i-4)*6)); ellipse.setAttribute('ry','17'); pattern.appendChild(ellipse); }
for (let i=0;i<13;i++) { const path=document.createElementNS('http://www.w3.org/2000/svg','path'); const x=160+i*15; path.setAttribute('d',`M ${225+(i-6)*4} 85 C ${250+(i-6)*2} 170, ${x} 205, ${x} 320`); path.setAttribute('opacity','.45'); pattern.appendChild(path); }
