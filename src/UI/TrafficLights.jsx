import React, { useRef, useState } from 'react';
import './TrafficLights.css';
export default function TrafficLights(props){
  const maximize = useRef();
  const [isMaximized, setIsMaximized] = useState(false);
  let win = null;
  const {remote} = require('electron')
  win = () => remote.BrowserWindow.getFocusedWindow()
  const handlerMin = () => win().minimize();
  const handlerMax = () => {
    console.log('handlerMaxclick')
    if (win().isMaximized() === false) {
      win().maximize()
      setIsMaximized(true);
      maximize.current.className='window-unmaximize';
      //maximize.current.classList.add(styles['window-unmaximize']);
      //maximize.current.classList.remove(styles['window-maximize']);
      return;
    } else if (win().isMaximized() === true) {
      win().unmaximize();
      setIsMaximized(false);
      maximize.current.className='window-maximize';
      //maximize.current.classList.add(styles['window-maximize']);
      //maximize.current.classList.remove(styles['window-unmaximize']);
      return;
    }
  };

  const handlerClose = () => win().close();

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
        Nozomi.la Crawler
      </span>
    </div>
    </>
  );
};