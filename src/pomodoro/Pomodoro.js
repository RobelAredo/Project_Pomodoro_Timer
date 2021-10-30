import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import PomodoroSession from "./PomodoroSession";
import SessionPlayPauseStopControl from "./SessionPlayPauseStopControl";
import SessionTimeButtonControl from "./SessionTimeButtonControl";

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

function nextSession(focusDuration, breakDuration) {
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration,
    };
  };
}

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);
  const initialValues = {focus:1500, break:300, stop:true, pause:true}
  const [pomodoroValues, setPomodoroValues] = useState({...initialValues});

  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(pomodoroValues.focus, pomodoroValues.break));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: pomodoroValues.focus,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });

    setPomodoroValues((values) => { return {...values, pause: !values.pause, stop:false}})
  }


  const handleDurationClick = (duration, change) => {
    const increment = duration === "focus" ? 300 : 60;
    const time = change === "+" ? pomodoroValues[duration] + increment : pomodoroValues[duration] - increment;
    const aboveMinimumDuration = duration === "focus" ? time >= 300 : time >= 60;
    const underMaximumDuration = duration === "focus" ? time <= 3600 : time <= 900;
    if (aboveMinimumDuration && underMaximumDuration) {
      setPomodoroValues((pomodoro) => {
        return {...pomodoro, [duration]:time}
      });
    }
  }

  const handleStop = () => {
    setSession(null);
    setIsTimerRunning(false);
    setPomodoroValues({...initialValues});
  }

  const convertSecondsToMinutes = (timeInSeconds) => {
    const minutes = ~~(timeInSeconds/60)
    const minutesDisplay = minutes > 9 ? minutes : "0" + minutes
    const seconds = timeInSeconds%60
    const secondsDisplay = seconds > 9 ? seconds : "0" + seconds
    const time = `${minutesDisplay}:${secondsDisplay}`
    return time;
  }

  return (
    <div className="pomodoro">
      <SessionTimeButtonControl 
        pomodoroValues={pomodoroValues}
        handleDurationClick={handleDurationClick}
        convertSecondsToMinutes={convertSecondsToMinutes}
      />
      <SessionPlayPauseStopControl
        pomodoroValues={pomodoroValues}
        isTimerRunning={isTimerRunning}
        playPause={playPause}
        handleStop={handleStop}
      />
      <PomodoroSession
        session = {session}
        convertSecondsToMinutes={convertSecondsToMinutes}
        pomodoroValues={pomodoroValues}
      />
    </div>
  );
}

export default Pomodoro;
