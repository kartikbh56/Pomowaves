/* eslint-disable react/prop-types */
export default function TimelineController({
    currentTimeLine,
    prevBtnHandler,
    nextBtnHandler,
    formatFunction,
  }) {
    return (
      <div className="timeline-controller">
        <button onClick={prevBtnHandler} title="Previous day">
          &lt;
        </button>
        <span>{formatFunction(currentTimeLine)}</span>
        <button onClick={nextBtnHandler} title="Next day">
          {" "}
          &gt;
        </button>
      </div>
    );
  }