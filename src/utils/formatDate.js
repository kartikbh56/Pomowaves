// (new Date(2025, 06, 28), new Date(2025, 07, 3)) => 28 Jul - 3 Aug
function formatWeek(firstDayOfTheWeek, lastDayOfTheWeek) {
  return (
    `${firstDayOfTheWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} (${firstDayOfTheWeek.toLocaleDateString("en-US", {
      weekday: "short",
    })})` +
    " - " +
    `${lastDayOfTheWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} (${lastDayOfTheWeek.toLocaleDateString("en-US", {
      weekday: "short",
    })})`
  );
}

// (new Date()) => Today (29 Jul)
// (new Date(2025,7,27,16,0)) => Thu, Jul 27
function formatDay(date) {
  const today = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return date.toLocaleDateString() === today.toLocaleDateString()
    ? ` ${date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })}` + " (Today)"
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

// (new Date(2025,7,29,16,0)) => July 2025
function formatMonth(dayOfTheMonth) {
  return dayOfTheMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// (150) => 2h 30m
function formatMinutes(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  if (hrs > 0) return `${hrs}h ${mins > 0 ? `${mins}m` : ""}`;
  return `${mins}m`;
}

// (new Date(2025,7,29,16,0), new Date(2025,7,29,16,40)) => 40
const getMinutes = (startedAt, endedAt) =>
  Math.round((new Date(endedAt) - new Date(startedAt)) / (1000 * 60));

// at 4:50 PM => getFinishTime(3600) => {hh: '05', mm: '50', meridiem: 'PM'}
function getFinishTime(timeRequired) {
  const finishAt = new Date(Date.now() + timeRequired * 1000);
  const finishAtHrs24h = finishAt.getHours();
  const finishAtHrs12h = finishAtHrs24h % 12 || 12;
  const finishAtMins = finishAt.getMinutes();
  const ampm = finishAtHrs24h >= 12 ? "PM" : "AM";

  return {
    hh: String(finishAtHrs12h).padStart(2, "0"),
    mm: String(finishAtMins).padStart(2, "0"),
    ampm,
  };
}

function getTimeStamps(view, referenceDate) {
  const START_OF_DAY = [0, 0, 0];
  const END_OF_DAY = [23, 59, 59];
  const date = new Date(referenceDate);

  let start, end;

  const startDateMap = {
    day: () => new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...START_OF_DAY),
    week: () => new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7), ...START_OF_DAY),
    month: () => new Date(date.getFullYear(), date.getMonth(), 1, ...START_OF_DAY),
  };

  const endDateMap = {
    day: () => new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...END_OF_DAY),
    week: () => new Date(startDateMap.week().getFullYear(), startDateMap.week().getMonth(), startDateMap.week().getDate() + 6, ...END_OF_DAY),
    month: () => new Date(date.getFullYear(), date.getMonth() + 1, 0, ...END_OF_DAY),
  };

  start = startDateMap[view]();
  end = endDateMap[view]();
  return { start, end };
}

const getFocusDuration = (start, end) => {
  const diffMs = new Date(end) - new Date(start);
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours > 0 ? `${hours}h ` : ""}${remMins > 0 ? remMins + "m" : ""}`;
};

export {
  formatMinutes,
  formatDay,
  formatMonth,
  formatWeek,
  getMinutes,
  getFinishTime,
  getTimeStamps,
  getFocusDuration,
};
