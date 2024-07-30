// global.d.ts
import webpush from 'web-push';

declare global {
  var subscriptions: webpush.PushSubscription[];
}
