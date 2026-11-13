import { useEffect, useRef } from 'react';
import { siteMarkup } from './siteMarkup';
import { withCommunityPartners } from './azureCommunityPartner';

export default function App() {
  const siteRef = useRef(null);

  useEffect(() => {
    const mount = siteRef.current;
    if (!mount) return undefined;

    mount.innerHTML = withCommunityPartners(siteMarkup);

    // Load the page interactions only after React has mounted all site controls.
    const script = document.createElement('script');
    script.src = '/script.js';
    script.async = false;
    script.onerror = () => {
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

    return () => {
      script.remove();
      mount.innerHTML = '';
    };
  }, []);

  return <div ref={siteRef} className="site-root" />;
}
