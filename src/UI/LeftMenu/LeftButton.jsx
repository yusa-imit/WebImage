import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LeftButton.css'

export default function LeftButton(props){
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
            <div className={"LeftButton-wrapper"} onClick={()=>{click?setClick(false):setClick(true)}}>
                
                <span className='LeftButton-text'>
                    <FontAwesomeIcon className='LeftButton-icon' icon={props.source.icon}/>
                    <span>{props.source.name}</span>
                    </span>
            </div>
        </>
    )
}