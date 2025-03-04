self.addEventListener("push", (event) => {
    const data = event.data?.json() || { title: "Notification", body: "You have a new message!" };
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png", // Replace with your icon path if needed
    });
  });
  