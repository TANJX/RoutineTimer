import './App.scss';
import routine from './routine';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const useCountdown = (endTime) => {
  const [countDown, setCountDown] = useState(
    endTime - Date.now(),
  );

  useEffect(() => {
    console.log(endTime, 'setInterval');
    const interval = setInterval(() => {
      const diff = endTime - Date.now();
      if (diff < 0) {
        setCountDown(0);
        clearInterval(interval);
      } else {
        setCountDown(diff);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTime]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

const Timer = ({ title, endTime, duration, finishedTime, totalDuration, onExpire }) => {
  const [expire, setExpire] = useState(false);
  const { minutes, seconds } = useCountdown(endTime);

  useEffect(() => {
    setTimeout(() => {
      setExpire(false);
    }, 1000);
  }, ([endTime]));

  useEffect(() => {
    document.title = title;
  });

  if (!expire && minutes + seconds <= 0) {
    console.log('call expire');
    setExpire(true);
    onExpire();
  }

  const stateFinishedTime = (minutes * 60 + seconds);
  let percent = 100 - stateFinishedTime / duration * 100;
  if (percent > 100) percent = 100;

  const barStyle = {
    width: `${percent}%`,
  };

  let totalPercent = (duration - stateFinishedTime + finishedTime) / totalDuration * 100;

  const totalbarStyle = {
    width: `${totalPercent}%`,
  };

  return (
    <div className="timer">
      <div className="totalprogress">
        <div className='bar' style={totalbarStyle}></div>
      </div>
      <div className='controls'>
        {/* <button onClick={isRunning ? pause : resume}>Resume</button> */}
      </div>
      <div className='main'>
        <p className='title'>{title}</p>
        <p className='time'>
          <span className='minute'>{minutes}</span>
          <span className='colon'>:</span>
          <span className='second'>{seconds < 10 ? `0${seconds}` : seconds}</span>
        </p>
      </div>
      <div className="progress">
        <div className='bar' style={barStyle}></div>
      </div>
    </div>

  );
}

function App() {
  const [playing, playSound] = useAudio("n1.mp3");
  const [routineState, setRoutineState] = useState(0);
  const [startTime, setStartTime] =
    useState(dayjs().add(routine[routineState].duration, 's').valueOf());

  let totalTime = 0;
  let finishedTime = 0;
  for (let i = 0; i < routine.length; i++) {
    if (i < routineState) finishedTime += routine[i].duration;
    totalTime += routine[i].duration;
  }

  const handleExpire = () => {
    // console.warn('expire');
    playSound();
    if (routineState + 1 < routine.length) {
      setRoutineState(routineState + 1);
      setStartTime(dayjs().add(routine[routineState + 1].duration, 's').valueOf());
    }
  }

  return (
    <div className="App">
      <Timer
        title={routine[routineState].title}
        duration={routine[routineState].duration}
        totalDuration={totalTime}
        finishedTime={finishedTime}
        endTime={startTime}
        onExpire={handleExpire}
      ></Timer>
    </div>
  );
}

export default App;
