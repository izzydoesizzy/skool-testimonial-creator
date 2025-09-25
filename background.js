// background.js
// The background service worker is kept intentionally minimal.
// It currently does not perform any tasks but serves as a placeholder
// for future features such as context menu support or persistent state.

// Listen for the installation event and seed default storage values.
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Claim any open clients immediately so the popup can communicate
  event.waitUntil(self.clients.claim());
});
