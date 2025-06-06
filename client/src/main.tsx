import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function updateDarkClass(e = null) {
  const isDark = e ? e.matches : darkQuery.matches;
  document.documentElement.classList.toggle('dark', isDark);
}

updateDarkClass();
darkQuery.addEventListener('change', updateDarkClass);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado exitosamente:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Nueva versión de la app disponible');
        });
      })
      .catch((error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      });
  });

  // Listen for app install prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 App lista para instalar');
    e.preventDefault();
    deferredPrompt = e;
    
    // You can show a custom install button here
    // For now, we'll just log it
    console.log('💡 Tip: Usa el menú del navegador para "Agregar a pantalla de inicio"');
  });

  window.addEventListener('appinstalled', () => {
    console.log('🎉 App instalada exitosamente');
    deferredPrompt = null;
  });
}

// Prevent zoom on iOS Safari when focusing inputs
document.addEventListener('touchstart', {}, true);

// Handle viewport changes for mobile
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
