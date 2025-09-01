// ===== SERVICE WORKER FOR PWA =====

const CACHE_NAME = 'didmus-barasa-v1.0.0';
const STATIC_CACHE = 'didmus-static-v1.0.0';
const DYNAMIC_CACHE = 'didmus-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/agenda.html',
  '/news.html',
  '/gallery.html',
  '/get-involved.html',
  '/contact.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/ai-chat.js',
  '/assets/js/particles.js',
  '/manifest.json',
  // Add critical images and icons
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/images/logo.png',
  '/assets/images/didmus-avatar.jpg',
  // External resources
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Files to cache on demand
const DYNAMIC_ASSETS = [
  '/assets/images/',
  '/assets/videos/',
  '/assets/icons/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Fetch from network and cache dynamic content
        return fetch(request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Cache dynamic assets
            if (shouldCacheDynamically(request.url)) {
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  console.log('Service Worker: Caching dynamic asset', request.url);
                  cache.put(request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch((error) => {
            console.log('Service Worker: Fetch failed, serving offline page', error);
            
            // Serve offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html') || createOfflinePage();
            }
            
            // Serve placeholder for images
            if (request.destination === 'image') {
              return caches.match('/assets/images/placeholder.png') || createPlaceholderImage();
            }
            
            throw error;
          });
      })
  );
});

// Helper function to determine if asset should be cached dynamically
function shouldCacheDynamically(url) {
  return DYNAMIC_ASSETS.some(pattern => url.includes(pattern)) ||
         url.includes('.jpg') || url.includes('.jpeg') || 
         url.includes('.png') || url.includes('.webp') ||
         url.includes('.mp4') || url.includes('.webm');
}

// Create offline page response
function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en" data-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Didmus Barasa Campaign</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #0A192F, #112240);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 2rem;
            }
            .offline-container {
                max-width: 500px;
                background: rgba(255, 255, 255, 0.1);
                padding: 3rem;
                border-radius: 1rem;
                backdrop-filter: blur(10px);
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1.5rem;
                color: #FFD700;
            }
            h1 {
                font-size: 2rem;
                margin-bottom: 1rem;
                color: #FFD700;
            }
            p {
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            .retry-btn {
                background: linear-gradient(135deg, #FFD700, #f4d03f);
                color: #0A192F;
                border: none;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .retry-btn:hover {
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">📡</div>
            <h1>You're Offline</h1>
            <p>It looks like you're not connected to the internet. Don't worry, you can still browse the cached pages of Didmus Barasa's campaign website.</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
        </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Create placeholder image response
function createPlaceholderImage() {
  // Simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0A192F"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#FFD700" text-anchor="middle" dy=".3em">
        Image Unavailable Offline
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'newsletter-signup') {
    event.waitUntil(syncNewsletterSignups());
  }
  
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForms());
  }
  
  if (event.tag === 'volunteer-form') {
    event.waitUntil(syncVolunteerForms());
  }
});

// Sync newsletter signups when back online
async function syncNewsletterSignups() {
  try {
    const cache = await caches.open('newsletter-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('Service Worker: Newsletter signup synced');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync newsletter signup', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Error syncing newsletter signups', error);
  }
}

// Sync contact forms when back online
async function syncContactForms() {
  try {
    const cache = await caches.open('contact-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('Service Worker: Contact form synced');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync contact form', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Error syncing contact forms', error);
  }
}

// Sync volunteer forms when back online
async function syncVolunteerForms() {
  try {
    const cache = await caches.open('volunteer-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('Service Worker: Volunteer form synced');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync volunteer form', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Error syncing volunteer forms', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'Stay updated with the latest campaign news and events!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Campaign',
        icon: '/assets/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/action-close.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'Didmus Barasa Campaign';
  }
  
  event.waitUntil(
    self.registration.showNotification('Didmus Barasa Campaign', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification closed');
  
  // Track notification close for analytics
  // You could send this data to your analytics service
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered', event.tag);
  
  if (event.tag === 'news-update') {
    event.waitUntil(updateNewsCache());
  }
});

// Update news cache periodically
async function updateNewsCache() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await fetch('/api/news');
    
    if (response.ok) {
      await cache.put('/api/news', response);
      console.log('Service Worker: News cache updated');
    }
  } catch (error) {
    console.error('Service Worker: Failed to update news cache', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection', event.reason);
});

console.log('Service Worker: Loaded successfully');