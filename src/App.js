import React, { useState } from 'react';
import dayjs from 'dayjs';

import ROUTINE from './routine_v3';
import useAudio from './components/audio/Audio';
import Timer from './components/timer/Timer';
import './style/App.scss';

function App() {
  const [playing, playSound] = useAudio("n1.mp3");
  // 当前在routine第n个
  const [routineState, setRoutineState] = useState(0);
  const [routineEndTime, setRoutineEndTime] =
    useState(dayjs().add(ROUTINE[routineState].duration, 's').valueOf());
  const [pausedTime, setPausedTime] = useState(0);

  let totalTime = 0;
  let finishedTime = 0;
  for (let i = 0; i < ROUTINE.length; i++) {
    if (i < routineState) finishedTime += ROUTINE[i].duration;
    totalTime += ROUTINE[i].duration;
  }

  const handleExpire = () => {
    playSound();
    if (routineState + 1 < ROUTINE.length) {
      setRoutineEndTime(dayjs().add(ROUTINE[routineState + 1].duration, 's').valueOf());
      setRoutineState(routineState + 1);
    }
  }

  const handleReset = () => {
    setRoutineEndTime(dayjs().add(ROUTINE[0].duration, 's').valueOf());
    setRoutineState(0);
  }
  handleReset.bind(this);

  const handlePause = () => {
    setPausedTime(Date.now());
  }
  handlePause.bind(this);

  const handleResume = () => {
    const remainingTime = routineEndTime - pausedTime;
    setRoutineEndTime(Date.now() + remainingTime);
  }
  handlePause.bind(this);

  return (
    <div className="App">
      <Timer
        title={ROUTINE[routineState].title}
        nextTitle={routineState+1<ROUTINE.length?ROUTINE[routineState+1].title:''}
        duration={ROUTINE[routineState].duration}
        totalDuration={totalTime}
        finishedTime={finishedTime}
        endTime={routineEndTime}
        onExpire={handleExpire}
        onReset={handleReset}
        onPause={handlePause}
        onResume={handleResume}
      ></Timer>
    </div>
  );
}

export default App;
