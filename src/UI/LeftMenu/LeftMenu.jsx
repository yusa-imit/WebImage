import React from 'react'
import LeftButton from './LeftButton.jsx'
import {faDownload, faBookOpen, faLandmark, faCog} from '@fortawesome/free-solid-svg-icons';
import './LeftMenu.css'

export default function LeftMenu(props){
    const Buttons = [{name:'Viewer', icon:faBookOpen}, {name:'Download', icon:faDownload}, {name:'Library', icon:faLandmark}, {name:'Settings', icon:faCog}]
    const SetButtons = () =>{
        return (Buttons.map((button_tag, key)=>(<LeftButton key={key} source={button_tag}/>)));   
    }
    return(
        <>
            <div className='leftmenu-wrapper'>
                <div className='leftmenu-button-wrapper'>
                    {SetButtons()}
                </div>
                <div className='leftmenu-etc-wrapper'>

                </div>
            </div>
        </>
    );
}