/* eslint-disable react/prop-types */
export default function Progress({ percentage }) {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

