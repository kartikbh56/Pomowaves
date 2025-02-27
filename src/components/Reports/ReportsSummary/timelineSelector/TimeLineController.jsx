/* eslint-disable react/prop-types */
export default function TimelineController({
    currentTimeLine,
    prevBtnHandler,
    nextBtnHandler,
    formatFunction,
  }) {
    return (
      <div className="timeline-controller">
        <button onClick={prevBtnHandler}>
          &lt;
        </button>
        <span>{formatFunction(currentTimeLine)}</span>
        <button onClick={nextBtnHandler}>
          {" "}
          &gt;
        </button>
      </div>
    );
  }