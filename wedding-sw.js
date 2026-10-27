
/* Wedding Control Center - Push Notification Service Worker */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Wedding Control Center",
      body: event.data ? event.data.text() : "You have a new notification."
    };
  }

  const title = String(data.title || "Wedding Control Center");

  const options = {
    body: String(data.body || "You have a new notification."),
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: String(data.tag || "wedding-control"),
    renotify: true,
    data: {
      url: "/wedding-control.html"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    "/wedding-control.html",
    self.location.origin
  ).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });

      for (const windowClient of windows) {
        if (
          windowClient.url.startsWith(self.location.origin) &&
          "focus" in windowClient
        ) {
          await windowClient.navigate(targetUrl);
          return windowClient.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    })()
  );
});
