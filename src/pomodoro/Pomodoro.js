import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import PomodoroSession from "./PomodoroSession";

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
  const initialValues = {focus:1500, break:300, stop:true, pause:true, on:"focus"}
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
    if (session) {
      setSession(null);
      setIsTimerRunning(false);
      setPomodoroValues({...initialValues});
    }
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
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {convertSecondsToMinutes(pomodoroValues.focus)}
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={()=> handleDurationClick("focus", "-")}
                disabled={!pomodoroValues.stop}
              >
                <span className="oi oi-minus" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={()=> handleDurationClick("focus", "+")}
                disabled={!pomodoroValues.stop}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                Break Duration: {convertSecondsToMinutes(pomodoroValues.break)}
              </span>
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={()=> handleDurationClick("break", "-")}
                  disabled={!pomodoroValues.stop}
                >
                  <span className="oi oi-minus" />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={()=> handleDurationClick("break", "+")}
                  disabled={!pomodoroValues.stop}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={handleStop}
              disabled={pomodoroValues.stop}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div>
        <PomodoroSession duration={session?.label === "On Break" ? pomodoroValues.break : pomodoroValues.focus} secondsRemaining={session?.timeRemaining}
        label={session?.label} convertSecondsToMinutes={convertSecondsToMinutes}
        stop={pomodoroValues.stop} pause={pomodoroValues.pause}/>
      </div>
    </div>
  );
}

export default Pomodoro;
