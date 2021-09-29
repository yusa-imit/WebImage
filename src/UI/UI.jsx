import React, { useEffect, useState } from "react"
import TrafficLights from "./TrafficLights.jsx";
import LeftMenu from "./LeftMenu/LeftMenu.jsx";
import './UI.css'
import ImageOptimizer from "./Mainframe/ImageOptimizer.jsx";
import ParticlesBg from "particles-bg";
import { useSelector } from "react-redux";
import {initialize, get, set, getSync, setSync } from './settings.js';
import ImageToWebp from "./Mainframe/ImageToWebp.jsx";
import VideoToWebm from "./Mainframe/VideoToWebm.jsx";
import Progress from './Mainframe/popup/Progress.jsx';
import ErrorGuide from "./Mainframe/Component/ErrorGuide.jsx";
//import ImageToWebp from "./Mainframe/ImageToWebp.jsx";

//
// UI.jsx
//
// Entry Point for overall UI
// props : none
export default function UI(props) {
  // Configuration for background bubbles
  let config = {
    num: [2, 5],
    rps: 0.1,
    radius: [20, 120],
    life: [1.5, 3],
    v: [2, 3],
    tha: [-40, 40],
    alpha: [0.6, 0],
    scale: [.1, 0.4],
    position: "all",
    color: ["random", "#ffffff"],
    cross: "dead",
    emitter: "follow",
    random: 15
  };
  if (false) {
    config = Object.assign(config, {
      onParticleUpdate: (ctx, particle) => {
        ctx.beginPath();
        ctx.rect(
          particle.p.x,
          particle.p.y,
          particle.radius * 2,
          particle.radius * 2
        );
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
      }
    });
  }
  // State: buttonState
  // controls leftmenu buttons
  const [buttonState, setButtonState] = useState([true, false, false, false]);
  const changeButtonState = (num=undefined) =>{
    //console.log(num);
    var defaultState = [false, false, false, false];
    if(num!==undefined){
      defaultState[num] = true;
      setButtonState(defaultState)
    }
    else{
      defaultState[0] = true;
      setButtonState(defaultState);
    }
    //console.log(buttonState)
  }

  const mainframeSetter = () =>{
    switch (buttonState.indexOf(true)){
      case 0:
        return <ImageOptimizer setError={setError} setErrorText={setErrorText}/>
      case 1:
        return <ImageToWebp setIsProgress={setIsProgress} setProgressWindow={setProgressWindow} setProgressTotal={setProgressTotal} setProgressMessage={setProgressMessage}
        progressCancel={progressCancel} setProgressCancel={setProgressCancel}
        setError={setError} setErrorText={setErrorText}
        />
      case 2:
        return <VideoToWebm isProgress={isProgress} setIsProgress={setIsProgress} setProgressWindow={setProgressWindow} setProgressTotal={setProgressTotal} setProgressMessage={setProgressMessage}
            progressCancel={progressCancel} setProgressCancel={setProgressCancel}
            setError={setError} setErrorText={setErrorText}
        />
      default:
        return <ImageOptimizer/>
    }
  }
  //setSync('test', true);
  useEffect(() => {
    initialize();
  })
  console.log(getSync('test'))
  const [isProgress, setIsProgress] = useState(false);
  const [progressWindow, setProgressWindow] = useState(0);
  const [progressTotal,  setProgressTotal] = useState(0);
  const [progressMessage, setProgressMessage] = useState('CONSOLE');
  const [progressCancel, setProgressCancel] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(undefined);
  return (
    <>
      <div className="App">
        <TrafficLights />
        <div className="Main">
          <div className='particle-container'>
            <ParticlesBg type="custom" config={config} bg={{ position: "absolute", width: "100%", height: "100%", top: "0px", left: "0", background: "transparent" }} num={10} />
          </div>
          <LeftMenu  buttonState={buttonState.indexOf(true)} changeButtonState={(num)=>{changeButtonState(num)}}/>
          <div className='Mainframe'>
            {mainframeSetter()}
          </div>
          <Progress isProgress={isProgress} progress={progressWindow} total={progressTotal} onCloseClick={()=>{setIsProgress(false)}} onCalcelClick={()=>{setProgressCancel(false)}} message={progressMessage} progressCancel={progressCancel} />
          <ErrorGuide error={error} text={errorText} onClick={()=>{setError(false)}} />
        </div>

      </div>
    </>
  );
}