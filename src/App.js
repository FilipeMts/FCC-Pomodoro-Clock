import React, { useState, useEffect, useRef } from 'react';
import beep from './assets/audio/beep.mp3'
import './App.scss';

const App = () => {
  const [clock, setClock] = useState({
    sessionDuration: 25,
    breakDuration: 5,
    timerIsOn: false, 
    currentTimer: 'Session',
    seconds: 25 * 60
  });

  const audioRef = useRef();

  const formatSeconds = currentSecs => {
    if (currentSecs === 3600) {
      return {
        minutes: 60,
        seconds: '00'
      };
    };

    const secondsLeft = currentSecs;
    let seconds = secondsLeft % 60;
    let minutes = parseInt(secondsLeft / 60) % 60;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    let currTime = {
      minutes: minutes,
      seconds: seconds
    };    
    return currTime;
  };

  const playAudio = () => {
    audioRef.current.play();
  };

  const stopAudio = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.pause();
  };

  const resetClock = () => {
    setClock({
      ...clock,
      breakDuration: 5,
      sessionDuration: 25, 
      currentTimer: 'Session',
      timerIsOn: false, 
      seconds: 25 * 60
    })
    stopAudio();
  };

  const incDecClock = (e, currentLength, label) => {
    const { value } = e.target;

    if (clock.timerIsOn === false) {
      if (currentLength > 1 && label === 'Break' && value === '-') {
          setClock({
          ...clock,
          breakDuration: currentLength - 1,            
        })
      }
      else if (currentLength < 60 && label === 'Break'  && value === '+') {
        setClock({
          ...clock,
          breakDuration: currentLength + 1
        })  
      }
      else if (currentLength > 1 && label === 'Session'  && value === '-') {
        setClock({
          ...clock,
          sessionDuration: currentLength - 1,
          seconds: (currentLength - 1 ) * 60
        })
      }      
      else if (currentLength < 60 && label === 'Session'  && value === '+') {
        setClock({
          ...clock,
          sessionDuration: currentLength + 1,
          seconds: (currentLength + 1) * 60 
        })        
      }
    }; 
  };

  const toggleTimer = () => {
    if (clock.timerIsOn === false) {
      setClock({
        ...clock,
        timerIsOn: true
      })
    }
    else  {
      setClock({
        ...clock,
        timerIsOn: false
      })
    };
  };

  const switchTimer = () => {
    if (clock.currentTimer === "Session") {
      setClock({
        ...clock,
        seconds: clock.breakDuration * 60,
        currentTimer: 'Break'
      })
    }
    else if (clock.currentTimer === "Break") {
      setClock({
      ...clock,
      seconds: clock.sessionDuration * 60,
      currentTimer: 'Session'
      })
    }
  };

  useEffect(() => {
    let interval = null;
    if (clock.timerIsOn) {
      if (clock.seconds === 0) {
        playAudio();
        switchTimer();
      }
      interval = setInterval(() => {
        setClock({
          ...clock,
          seconds: clock.seconds - 1
        })
      }, 1000);
    } else if (clock.timerIsOn === false && clock.seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [clock.timerIsOn, clock.seconds]);

  const currentTime = formatSeconds(clock.seconds);

  return (
    <div className="App">
      <div className='clock-container'>
        <h3>Pomodoro Clock</h3>
        <div>
          <p id='timer-label'>{clock.currentTimer}</p>
          <p id='time-left'>{currentTime.minutes + ":" + currentTime.seconds}</p>
        </div>
        <div className='controls'>
          <button id="start_stop" onClick={toggleTimer}><i className="far fa-play-circle"></i><i className="fas fa-pause" title='play/pause'></i></button>
          <button id="reset" onClick={resetClock}><i className="fas fa-sync-alt" title='reset'></i></button>          
        </div>      
        <div className='break-session-wrapper'>
          <div id='break-label'>
            <div><p>Break Time</p></div>
            <div>
              <button id='break-increment' value='+' onClick={e => incDecClock(e, clock.breakDuration, 'Break')}><i className="fas fa-plus"></i></button>
              <div id='break-length'>{clock.breakDuration}</div>
              <button id='break-decrement' value='-' onClick={e => incDecClock(e, clock.breakDuration, 'Break')}><i className="fas fa-minus"></i></button>            
            </div>            
          </div>
          <div id='session-label'>
            <div><p>Session Time</p></div>
            <div>
              <button id='session-increment' value='+' onClick={e => incDecClock(e, clock.sessionDuration,'Session')}><i className="fas fa-plus"></i></button>
              <div id='session-length'>{clock.sessionDuration}</div>
              <button id='session-decrement' value='-' onClick={e => incDecClock(e, clock.sessionDuration, 'Session')}><i className="fas fa-minus"></i></button>            
            </div>
          </div>
        </div>
        </div>
        <div className="code">
        <a href="" target="_blank" rel="noopener noreferrer">code is available here</a>
        </div>    
      <audio id="beep" src={beep} ref={audioRef}/>
    </div>
  );
};

export default App;
