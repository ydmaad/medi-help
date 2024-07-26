"use client";

import { useEffect } from 'react';

const VAPID_PUBLIC_KEY = 'BCz6MmO4s5w9arfyIj08dZC2mdGVP5CZdmlJt5FXh4N49HLCphlqvIM3nnKN0OmuTz3R4ykh-UCSlY0BCuxym4w';

const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          registration.pushManager.getSubscription()
            .then(subscription => {
              if (subscription) {
                subscription.unsubscribe().then(() => {
                  console.log('Existing subscription canceled');
                  subscribeUser(registration);
                }).catch(error => {
                  console.error('Failed to unsubscribe:', error);
                  subscribeUser(registration);
                });
              } else {
                subscribeUser(registration);
              }
            });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const subscribeUser = (registration: ServiceWorkerRegistration) => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }).then(subscription => {
          console.log('Push Manager subscription:', subscription);
          fetch('/api/mypage/alerts/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data => {
            console.log('Subscription sent to server:', data);
          }).catch(error => {
            console.error('Failed to send subscription:', error);
          });
        }).catch(error => {
          console.error('Push subscription failed:', error);
        });
      } else {
        console.log('Notification permission denied');
      }
    });
  };

  return null;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default ServiceWorkerRegister;
