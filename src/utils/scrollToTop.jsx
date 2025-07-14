// src/utils/scrollToTop.jsx
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // disable the browser’s built-in “remember scroll position on reload”
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // force scroll to top on every route change (and on initial load)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
