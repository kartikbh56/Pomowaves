/* eslint-disable react/prop-types */
export default function Time({ secondsRemaining }) {
    return (
      <div className="time">
        {`${Math.floor(secondsRemaining / 60)}`.padStart(2, "0") +
          " : " +
          `${secondsRemaining % 60}`.padStart(2, "0")}
      </div>
    );
  }