importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDxAKcOaXLD5v9CFSB6d7CP2n6_3gmUIRE",
  authDomain: "v-hospitality-notification.firebaseapp.com",
  projectId: "v-hospitality-notification",
  storageBucket: "v-hospitality-notification.appspot.com",
  messagingSenderId: "854763270562",
  appId: "1:854763270562:web:eb2aaab47449a1dbbc02fb",
  measurementId: "G-33WWMH8CXR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload?.notification?.title;
  const notificationOptions = {
    body: payload?.notification?.body || payload?.notification?.title,
    renotify: true,
    requireInteraction: true,
    tag: notificationTitle,
    icon: "assets/icons/v-logo-black.svg",
    image: "assets/icons/v-logo-black.svg",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      })
  );
});