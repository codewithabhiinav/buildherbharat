import { siteMarkup } from './siteMarkup.js';
import { withAzureCommunityPartner } from './azureCommunityPartner.js';

const root = document.getElementById('root');
if (!root) {
  throw new Error('BuildHer Bharat root element is missing.');
}

let mount = root.querySelector('.site-root');
if (!mount) {
  mount = document.createElement('div');
  mount.className = 'site-root';
  root.appendChild(mount);
}
if (!mount.hasAttribute('data-prerendered')) {
  mount.innerHTML = withAzureCommunityPartner(siteMarkup);
}

const script = document.createElement('script');
script.src = '/script.js';
script.async = false;
script.onerror = () => {
  const state = mount.querySelector('#music-state');
  if (state) state.textContent = 'LOAD ERROR';
  const loader = document.getElementById('site-loader');
  if (loader) {
    loader.classList.add('loader-hidden');
    window.setTimeout(() => loader.remove(), 900);
  }
  document.body.classList.add('page-ready');
  console.error('BuildHer Bharat page script could not be loaded.');
};
document.body.appendChild(script);

const audio = mount.querySelector('#site-music');
const audioState = mount.querySelector('#music-state');
if (audio && audioState) {
  audio.addEventListener('error', () => {
    audioState.textContent = 'AUDIO ERROR';
    console.error('BuildHer Bharat soundtrack could not be loaded:', audio.error);
  }, { once: true });
  audio.addEventListener('canplay', () => {
    if (audioState.textContent === 'AUDIO ERROR') audioState.textContent = 'OFF';
  }, { once: true });
  // The soundtrack is user-initiated; keep it unloaded until Play is pressed.
  audio.preload = 'none';
}
