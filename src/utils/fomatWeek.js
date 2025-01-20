export default function formatWeek(date) {
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
