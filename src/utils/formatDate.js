function formatWeek(date) {
  const firstDayOfTheWeek = new Date(date);
  firstDayOfTheWeek.setDate(
    firstDayOfTheWeek.getDate() - (firstDayOfTheWeek.getDay() || 7) + 1
  );

  const lastDayOfTheWeek = new Date(date);
  lastDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 6);

  return (
    firstDayOfTheWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) +
    " - " +
    lastDayOfTheWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );
}

function formatDay(date) {
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

function formatMonth(dayOfTheMonth) {
  return dayOfTheMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const formatMinutes = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

const getMinutes = (startedAt, endedAt) =>
  Math.round((new Date(endedAt) - new Date(startedAt)) / (1000 * 60));

export { formatMinutes, formatDay, formatMonth, formatWeek, getMinutes };
