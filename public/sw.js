self.addEventListener('push', function(event) {
  console.log('Push event received:', event);

  if (event.data) {
    const data = event.data.json();
    console.log('Push data:', data);
    const options = {
      body: data.body,
      icon: data.icon || 'https://example.com/default-icon.png',
      badge: data.badge || 'https://example.com/default-badge.png',
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
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

      const matchingClient = windowClients.find(windowClient => {
        return windowClient.url === urlToOpen;
      });

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
