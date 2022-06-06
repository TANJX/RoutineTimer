import './App.scss';
import { useTimer } from 'react-timer-hook';
import dayjs from 'dayjs';
import React, { useState } from 'react';


const Timer = ({ endTime, duration }) => {
  const {
    seconds,
    minutes,
    isRunning,
    pause,
    resume,
  } = useTimer({
    expiryTimestamp: endTime,
    onExpire: () => console.warn('onExpire called'),
  });

  let percent = 100 - (minutes * 60 + seconds) / duration * 100;
  if (percent > 100) percent = 100;
  console.log({ duration: Math.round(duration) + 's', end: dayjs(endTime).format("mm:ss") })

  const barStyle = {
    width: `${percent}%`,
  };

  return (
    <div className="timer">
      <div className='controls'>
        <button onClick={isRunning ? pause : resume}>Resume</button>
      </div>
      <div className='main'>
        <p className='title'>1分钟 第1个</p>
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
  const [duration, setDuration] = useState(Math.random() * 100);
  console.log({duration});
  return (
    <div className="App">
      <button onClick={() => { setDuration(Math.random() * 100) }}>change</button>
      <Timer duration={duration} endTime={dayjs().add(duration, 's').valueOf()}></Timer>
    </div>
  );
}

export default App;
