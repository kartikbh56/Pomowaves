/* eslint-disable react/prop-types */
export default function TimelineController({
  formattedDate,
    prevBtnHandler,
    nextBtnHandler,
  }) {
    return (
      <div className="timeline-controller">
        <button onClick={prevBtnHandler}>
          &lt;
        </button>
        <span>{formattedDate}</span>
        <button onClick={nextBtnHandler}>
          {" "}
          &gt;
        </button>
      </div>
    );
  }