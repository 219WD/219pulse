export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }

  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function showSystemNotification(title: string, body: string, emoji?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    const fullTitle = emoji ? `${emoji} ${title}` : title;
    const n = new Notification(fullTitle, {
      body,
      badge: "/favicon.ico",
      icon: "/favicon.ico",
      silent: false,
      tag: `pulse-${title}`,
    });

    setTimeout(() => n.close(), 8000);
  } catch {
    // noop
  }
}