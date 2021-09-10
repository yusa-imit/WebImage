import React, { useEffect, useState } from "react"
import TrafficLights from "./TrafficLights.jsx";
import LeftMenu from "./LeftMenu/LeftMenu.jsx";
import './UI.css'
import ImageOptimizer from "./Mainframe/ImageOptimizer.jsx";
import ParticlesBg from "particles-bg";
import { useSelector } from "react-redux";
import { get, set, getSync, setSync } from './settings.js';

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
  const [buttonState, setButtonState] = useState([false, false, false, false]);
  const changeButtonState = (num) =>{
    var defaultState = [false, false, false, false];
    defaultState[num] = true;
    setButtonState([defaultState]);
  }
  setSync('test', true);
  return (
    <>
      <div className="App">
        <TrafficLights />
        <div className="Main">
          <div className='particle-container'>
            <ParticlesBg type="custom" config={config} bg={{ position: "absolute", width: "100%", height: "100%", top: "0px", left: "0", background: "transparent" }} num={10} />
          </div>
          <LeftMenu buttonState={buttonState} changeButtonState={(num)=>{changeButtonState(num)}}/>
          <div className='Mainframe'>
            <ImageOptimizer/>
          </div>

        </div>

      </div>
    </>
  );
}