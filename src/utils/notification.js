export const sendNotification = (message) => {
  if (Notification.permission === "granted") {
    // Check for service worker registration for mobile compatibility
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        // Use service worker for mobile devices
        registration.showNotification(message, {
          icon: "", // Replace with your icon path if needed
        });
      } else {
        // Fallback for desktop browsers if no service worker is registered
        new Notification(message, {
          icon: "", // Replace with your icon path if needed
        });
      }
    });
  } else if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        sendNotification(message); // Retry if permission is granted
      }
    });
  }
};
