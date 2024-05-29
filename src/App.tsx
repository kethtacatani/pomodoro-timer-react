import { useState, useEffect } from "react";

import "./App.css";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}

function App() {
  const [seconds, setSeconds] = useState(1500);
  const [hasStarted, setHasStarted] = useState(false);
  const [formattedTime, setFormattedTime] = useState(formatTime(seconds));
  const [sessionTime, setSessionTime] = useState(25);
  const [breakSeconds, setBreakSeconds] = useState(300);
  const [breakTime, setBreakTime] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [startText, setStartText] = useState("Start");
  const [label, setLabel] = useState("Session");
  const [bgColor, setBgColor] = useState("#118219")

  const restartTimer = () => {
    setHasStarted(false);
    setSessionTime(25);
    setBreakTime(5);
    setSeconds(25 * 60);
    setStartText("Start");
    setLabel("Session");
    setIsPaused(false);
    stopAudio();
  };

  const playAudio = () => {
    const audioElement = document.getElementById("beep") as HTMLAudioElement;
    if (audioElement) {
      audioElement.play();
    }
  };

  const stopAudio = () => {
    const audioElement = document.getElementById("beep") as HTMLAudioElement;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    if (hasStarted) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return !isPaused ? prevSeconds - 1 : prevSeconds - 0;
          } else {
            if (label === "Break"){
                setLabel('Session')
              setSeconds(sessionTime * 60);
              setBgColor("#118219")
            }else if (label === "Session") {
              setSeconds(breakTime * 60);
              setLabel("Break");
              setBgColor("#821111")
            }
            playAudio();
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
          clearInterval(interval);
      }
  };
  }, [hasStarted, isPaused, label]);

  const startTimer = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setSessionTime(sessionTime);
      setStartText("Pause");
    } else if (startText === "Pause") {
      setIsPaused(true);
      setStartText("Resume");
    } else {
      setIsPaused(false);
      setStartText("Pause");
      setHasStarted(true);
    }
  };

  const setTime = (type: string) => {
    console.log("prev "+sessionTime);
    
    if (hasStarted && !isPaused) {
      return;
    } else if (type === "breakDec") {
      if (breakTime > 1) {
        setBreakTime((prevBreakTime) => {
          const newBreakTime = prevBreakTime - 1;
          setBreakSeconds(newBreakTime * 60);
          return newBreakTime;
        });
      }
    } else if (type === "breakInc") {
      if (breakTime < 60) {
        setBreakTime((prevBreakTime) => {
          const newBreakTime = prevBreakTime + 1;
          setBreakSeconds(newBreakTime * 60);
          return newBreakTime;
        });
      }
    } else if (type === "sessionDec") {
      if (sessionTime > 1 && sessionTime <60) {
        setSessionTime((prevSessionTime) => {
          const newSessionTime = prevSessionTime - 1;
          setSeconds(newSessionTime * 60);
          return newSessionTime;
        });
      }
    } else if (type === "sessionInc") {
      if (sessionTime < 60 && sessionTime >0) {
        setSessionTime((prevSessionTime) => {
          const newSessionTime = prevSessionTime + 1;
          setSeconds(newSessionTime * 60);
          return newSessionTime;
        });
      }
    }
  };

  useEffect(() => {
    setFormattedTime(formatTime(seconds));
  }, [seconds]);

  

  return (
    <>
      <div id="body" style={{backgroundColor:bgColor, transition:"background-color 2s ease"}}>
      <div className="container">
        <p style={{ fontSize: "30px", fontWeight: "bold" }}>Pomodoro Timer</p>
        <div className="length-container">
          <div className="breaks">
            <p id="break-label">Break Length</p>
            <div className="buttons">
              <button id="break-decrement" onClick={() => setTime("breakDec")}>
                <i className="fa fa-arrow-down fa-2x"></i>
              </button>
              <p id="break-length" className="lengths">
                {breakTime}
              </p>
              <button id="break-increment" onClick={() => setTime("breakInc")}>
                <i className="fa fa-arrow-up fa-2x"></i>
              </button>
            </div>
          </div>
          <div className="breaks">
            <p id="session-label">Session Length</p>
            <div className="buttons">
              <button
                id="session-decrement"
                onClick={() => setTime("sessionDec")}
              >
                <i className="fa fa-arrow-down fa-2x"></i>
              </button>
              <p id="session-length" className="lengths">
                {sessionTime}
              </p>
              <button
                id="session-increment"
                onClick={() => setTime("sessionInc")}
              >
                <i className="fa fa-arrow-up fa-2x"></i>
              </button>
            </div>
          </div>
        </div>
        <p
          id="timer-label"
          style={{ marginBottom: "-15px", marginTop: "10px" }}
        >
          {label}
        </p>
        <p id="time-left">{formattedTime}</p>
        <div className="button-controls">
          <button id="start_stop" className="play-reset" onClick={startTimer} style={{color:bgColor}}>
            {startText}
          </button>
          <button id="reset" className="play-reset" onClick={restartTimer} style={{color:bgColor}}>
            Reset
          </button>
        </div>
        <audio
          id="beep"
          src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        ></audio>
      </div>
      </div>
    </>
  );
}

export default App;
