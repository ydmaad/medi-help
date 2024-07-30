declare module 'web-push' {
  export interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void;

  export function sendNotification(
    subscription: PushSubscription,
    payload?: string,
    options?: {
      TTL?: number;
      vapidDetails?: {
        subject: string;
        publicKey: string;
        privateKey: string;
      };
      headers?: { [key: string]: string };
    }
  ): Promise<void>;
}
