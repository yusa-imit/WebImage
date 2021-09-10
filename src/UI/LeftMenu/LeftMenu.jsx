import React from 'react'
import LeftButton from './LeftButton.jsx'
import {faCog, faMagic, faImage, faVideo} from '@fortawesome/free-solid-svg-icons';
import './LeftMenu.css'

//
// LeftMenu.jsx
//
// LeftMenu main component
// props : changeButtonState - function
export default function LeftMenu(props){
    const Buttons = [{name:'Image Optimizer', icon:faMagic}, {name:'Image to Webp', icon:faImage}, {name:'Video to Webm', icon:faVideo}, {name:'Settings', icon:faCog}]
    const SetButtons = () =>{
        return (Buttons.map((button_tag, index)=>(<LeftButton key={index} index={index} source={button_tag} changeButtonState={props.changeButtonState}/>)));   
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