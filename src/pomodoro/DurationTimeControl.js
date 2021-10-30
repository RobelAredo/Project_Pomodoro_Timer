import React from "react";

function DurationTimeControl ({title, pomodoroValues, convertSecondsToMinutes, handleDurationClick}) {
  const label = title.toLowerCase();
  return (
    <div className="col">
        <div className="input-group input-group-lg mb-2">
          <span className="input-group-text" data-testid={`duration-${label}`}>
            {title} Duration: {convertSecondsToMinutes(pomodoroValues[label])}
          </span>
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-secondary"
              data-testid={`decrease-${label}`}
              onClick={()=> handleDurationClick(label, "-")}
              disabled={!pomodoroValues.stop}
            >
              <span className="oi oi-minus" />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-testid={`increase-${label}`}
              onClick={()=> handleDurationClick(label, "+")}
              disabled={!pomodoroValues.stop}
            >
              <span className="oi oi-plus" />
            </button>
          </div>
        </div>
      </div>
  )
}

export default DurationTimeControl;