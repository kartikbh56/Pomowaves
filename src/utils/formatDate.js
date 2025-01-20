export default function formatDate(date) {
    const today = new Date();

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    return date.toLocaleDateString() === today.toLocaleDateString()
      ? "Today" +
          ` (${date.toLocaleDateString("en-US", {
            day: "numeric",
            weekday: "short",
          })})`
      : date.toLocaleDateString() === yesterday.toLocaleDateString()
      ? "Yesterday " +
        `(${date.toLocaleDateString("en-US", {
          day: "numeric",
          weekday: "short",
        })})`
      : date.toLocaleDateString() === tomorrow.toLocaleDateString()
      ? "Tomorrow " +
        `(${date.toLocaleDateString("en-US", {
          day: "numeric",
          weekday: "short",
        })})`
      : date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
  }