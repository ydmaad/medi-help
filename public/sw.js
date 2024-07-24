self.addEventListener('push', function(event) {
  console.log('Push event received:', event);

  if (event.data) {
    const data = event.data.json();
    console.log('Push data:', data);
    const options = {
      body: data.body,
      icon: data.icon || '/default-icon.png',
      badge: data.badge || '/default-badge.png',
      data: {
        url: data.url || 'http://localhost:3000/'
      }
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } else {
    console.log('Push data is empty');
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click:', event);
  if (event.notification.data) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
