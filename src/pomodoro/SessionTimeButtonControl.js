import React, {useState} from "react";
import DurationTimeControl from "./DurationTimeControl";

function SessionTimeButtonControl ({pomodoroValues, handleDurationClick, convertSecondsToMinutes}) {

  return (
    <div className="row" style={{display: "row", justifyContent: "center"}}>
      <DurationTimeControl
        title="Focus"
        pomodoroValues={pomodoroValues}
        convertSecondsToMinutes={convertSecondsToMinutes}
        handleDurationClick={handleDurationClick}
      />
      <DurationTimeControl
        title="Break"
        pomodoroValues={pomodoroValues}
        convertSecondsToMinutes={convertSecondsToMinutes}
        handleDurationClick={handleDurationClick}
      />
    </div>
)
}

export default SessionTimeButtonControl;