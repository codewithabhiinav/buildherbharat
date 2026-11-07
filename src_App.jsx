import { useEffect, useRef } from 'react';
import { siteMarkup } from './siteMarkup';

export default function App() {
  const siteRef = useRef(null);

  useEffect(() => {
    const mount = siteRef.current;
    if (!mount) return undefined;

    mount.innerHTML = siteMarkup;

    // Load the page interactions only after React has mounted all site controls.
    const script = document.createElement('script');
    script.src = '/script.js';
    script.async = false;
    script.onerror = () => {
      const state = mount.querySelector('#music-state');
      if (state) state.textContent = 'LOAD ERROR';
      // Do not leave the preloader blocking the page if the interaction bundle fails.
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
    const state = mount.querySelector('#music-state');
    if (audio && state) {
      audio.addEventListener('error', () => {
        state.textContent = 'AUDIO ERROR';
        console.error('BuildHer Bharat soundtrack could not be loaded:', audio.error);
      }, { once: true });
      audio.addEventListener('canplay', () => {
        if (state.textContent === 'AUDIO ERROR') state.textContent = 'OFF';
      }, { once: true });
      // Playback is user-initiated; explicitly prime the audio source without autoplay.
      audio.load();
    }

    return () => {
      script.remove();
      mount.innerHTML = '';
    };
  }, []);

  return <div ref={siteRef} className="site-root" />;
}
