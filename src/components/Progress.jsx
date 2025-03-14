/* eslint-disable react/prop-types */
export default function Progress({ percentage, delay = 0.8 }) {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{
          width: `${percentage}%`,
          transition: `width ${delay}s ease-out`,
        }}
      ></div>
    </div>
  );
}
