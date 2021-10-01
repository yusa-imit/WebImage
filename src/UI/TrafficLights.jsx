import React, { useRef, useState } from 'react';
import './TrafficLights.css';

//
// TrafficLights.jsx
//
// Program Top bar component
// props : none
export default function TrafficLights(props) {
  //useRef for maximize function
  const maximize = useRef();
  // state: isMaximized 
  // dummy
  const [isMaximized, setIsMaximized] = useState(false);

  // Get Remote from Electron
  const { remote } = require('electron')
  let win = remote.BrowserWindow.getFocusedWindow()
  let win2 = remote.getCurrentWindow()

  // Minimize Handler
  const handlerMin = () => { try{win.minimize();}catch(e){ win2.minimize()} }

  // Maximize Handler
  const handlerMax = () => {
    //console.log(remote.getCurrentWindow());
    //console.log('handlerMaxclick')
    console.log(win)
    //const max = win.isMaximized()===null?undefined:win.isMaximized();
    if (win2.isMaximized()===false) {
      try {
        win.maximize()
        console.log('maximized by win1')
      }
      catch (e) {
        console.log('maximized by win2')
        win2.maximize()
      }

      setIsMaximized(true);
      maximize.current.className = 'window-unmaximize';
      //maximize.current.classList.add(styles['window-unmaximize']);
      //maximize.current.classList.remove(styles['window-maximize']);
      return;
    } else if (win2.isMaximized()===true ) {
      try {
        win.unmaximize();
      }
      catch (e) { win2.unmaximize(); }
      setIsMaximized(false);
      maximize.current.className = 'window-maximize';
      //maximize.current.classList.add(styles['window-maximize']);
      //maximize.current.classList.remove(styles['window-unmaximize']);
      return;
    }
  };

  // Close Handler
  const handlerClose = () => {try{ win.close();}catch (e) {win2.close()} }

  return (
    <>
      <div className='window-top-bar'>
        <div className='tl-container'>
          <div className={'window-controls-container'}>
            <div className={'wrap'} id='min-btn' onClick={handlerMin}>
              <div className={'one'}>
                <div className={'window-minimize'} />
              </div>
            </div>

            <div className={'wrap'} id='max-btn' onClick={handlerMax}>
              <div className={'two'}>
                <div className={'window-maximize'} ref={maximize} />
              </div>
            </div>

            <div className={'wrap'} id='close-btn' onClick={handlerClose}>
              <div className={'window-close-bg'}>
                <div className={'window-close'} />
              </div>
            </div>
          </div>
        </div>
        <span className='program-title-text'>
          WEB IMAGE
        </span>
      </div>
    </>
  );
};