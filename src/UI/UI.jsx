import React from "react"
import TrafficLights from "./TrafficLights.jsx";
import LeftMenu from "./LeftMenu/LeftMenu.jsx";
import './UI.css'
import ParticlesBg from "particles-bg";
export default function UI(props){
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

    return(
        <>
            <div className="App">
                <TrafficLights/>
                <div className="Main">
                    <div classname='particle-container'>
                        <ParticlesBg type="custom" config={config} bg={{position:"absolute", width:"100%", height:"100%", top:"0px", left:"0", background: "transparent"}} num={10}/>
                    </div>
                    <LeftMenu/>
                    <div className='Mainframe'>
                        
                    </div>
                    
                </div>
                
            </div>
        </>
    );
}