import { siteMarkup } from './siteMarkup.js';
import { withCommunityPartners } from './azureCommunityPartner.js';

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
  mount.innerHTML = withCommunityPartners(siteMarkup);
}

const script = document.createElement('script');
script.src = '/script.js';
script.async = false;
script.onerror = () => {
  const loader = document.getElementById('site-loader');
  if (loader) {
    loader.classList.add('loader-hidden');
    window.setTimeout(() => loader.remove(), 900);
  }
  document.body.classList.add('page-ready');
  console.error('BuildHer Bharat page script could not be loaded.');
};
document.body.appendChild(script);
