import React, { useState, useEffect } from 'react';

import PauseIcon from '../../icon/pause.svg';
import PlayIcon from '../../icon/play.svg';
import RestartIcon from '../../icon/restart.svg';

const useCountdown = (endTime, isPaused) => {
  const [countDown, setCountDown] = useState(
    endTime - Date.now(),
  );

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const interval = setInterval(() => {
      console.log({ isPaused, countDown });
      const remainTime = endTime - Date.now();
      if (remainTime < 0) {
        setCountDown(0);
        clearInterval(interval);
        console.log('clear interval 1');
      } else {
        setCountDown(remainTime);
        // console.log('interval', remainTime);
      }
    }, 500);

    return () => {
      if (interval) {
        clearInterval(interval);
        console.log('clear interval 2');
      }
    };
  }, [endTime, isPaused]);

  console.log({ countDown, endTime });

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
  const milliseconds = countDown % 1000;

  return { days, hours, minutes, seconds, milliseconds };
};

const Timer = (props) => {
  const {
    title,
    endTime,
    duration,
    finishedTime,
    totalDuration,
    onExpire,
    onReset,
    onPause,
    onResume,
  } = props;
  const [expire, setExpire] = useState(false);
  const [paused, setPaused] = useState(false);
  const { minutes, seconds, milliseconds } = useCountdown(endTime, paused);

  console.log({
    paused
  });

  useEffect(() => {
    setTimeout(() => {
      setExpire(false);
    }, 1000);
  }, ([endTime]));

  useEffect(() => {
    document.title = title;
  });

  if (!expire && minutes + seconds + milliseconds <= 0) {
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

  let totalFinishedTime = duration - stateFinishedTime + finishedTime;
  // 有bug(endTime和duration会比计时器剩余秒加载快) 先这样解决显示问题
  if (expire && endTime > Date.now()) {
    totalFinishedTime = finishedTime + 1;
  }
  let totalPercent = totalFinishedTime / totalDuration * 100;

  const totalbarStyle = { width: `${totalPercent}%`, };

  const durationString = `${Math.floor(totalFinishedTime / 60)}分${totalFinishedTime % 60}秒`;
  const totalDurationString = `${Math.floor(totalDuration / 60)}分${totalDuration % 60}秒`;

  const handlePause = () => {
    if (paused) {
      setPaused(false);
      onResume();
    } else {
      setPaused(true);
      onPause();
    }
  }


  return (
    <div className="timer">
      <div className="totalprogress">
        <div className='bar' style={totalbarStyle}></div>
        <p className='totalTime'>{`${durationString} / ${totalDurationString}`}</p>
      </div>
      <div className='controls'>
        <img className='pause' onClick={onReset} src={RestartIcon}></img>
        <img className='pause' onClick={handlePause} src={paused ? PlayIcon : PauseIcon}></img>
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

export default Timer;
