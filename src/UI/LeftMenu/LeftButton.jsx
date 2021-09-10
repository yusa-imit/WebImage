import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LeftButton.css'

//
// LeftButton.jsx
//
// Left menu button component
// props : index - number , source - array[name - string, icon - fontAwesomeIcon's icon]
// props : changeButtonState - function
export default function LeftButton(props){
    // State : click
    // set true when this button component is clicked
    const [click, setClick] = useState(false);
    const setClass = () =>{
        if(click){
            return 'LeftButton-wrapper-inset'
        }
        else{
            return 'LeftButton-wrapper'
        }
        
    }
    return(
        <>
            <div className={"LeftButton-wrapper"} onClick={()=>{props.changeButtonState(props.index)}}>
                
                <span className='LeftButton-text'>
                    <FontAwesomeIcon className='LeftButton-icon' icon={props.source.icon}/>
                    <span>{props.source.name}</span>
                    </span>
            </div>
        </>
    )
}