import React from "react"
import Paused from "./Paused"

function PomodoroSession ({secondsRemaining, duration, label, convertSecondsToMinutes, stop, pause}) {
  if (stop) return null;
  return ( 
    <>
    <div className="row mb-2">
      <div className="col">
          <h2 data-testid="session-title">
            {label} for {convertSecondsToMinutes(duration)} minutes 
          </h2>
          <p className="lead" data-testid="session-sub-title">
            {convertSecondsToMinutes(secondsRemaining)} remaining
          </p>
          <Paused paused={pause}/>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          <div className="progress" style={{ height: "20px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={(duration-secondsRemaining)/duration*100}
              style={{ width: `${(duration-secondsRemaining)/duration*100}%` }}
            />
          </div>
        </div>
      </div>
  </>
  )
}

export default PomodoroSession;