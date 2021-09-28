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
    const Buttons = [{name:'Image Optimizer', icon:faMagic}, {name:'Convert Image', icon:faImage}, {name:'Convert Video', icon:faVideo}, {name:'Settings', icon:faCog}]
    const SetButtons = () =>{
        return (Buttons.map((button_tag, index)=>(<LeftButton key={index} index={index} source={button_tag} buttonState={props.buttonState}  changeButtonState={props.changeButtonState}/>)));   
    }
    return(
        <>
            <div className='leftmenu-wrapper'>
                <div className='leftmenu-button-wrapper'>
                    <div className='leftmenu-3dfy'>
                        {SetButtons()}
                    </div>
                </div>
                <div className='leftmenu-etc-wrapper'>

                </div>
            </div>
        </>
    );
}