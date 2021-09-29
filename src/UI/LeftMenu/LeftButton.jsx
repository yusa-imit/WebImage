import React, { useState, useRef } from 'react'
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
    const setTextClass = () =>{
        if(props.index===props.buttonState){
            return 'LeftButton-text-clicked';
        }
        else{
            return 'LeftButton-text';
        }
        
    }
    const setBackgroundColor = () =>{
        if(props.index===props.buttonState){
            return 'LeftButton-background-clicked';
        }
        else{
            return 'LeftButton-background';
        }
    }
    const setWrapperStyle = () =>{
        if(props.index===props.buttonState){
            return {borderBottom:'1px solid #222', borderLeft:'1px solid #222'};
        }
        else{
            return {};
        }
    }
    const animation = useRef()
    return(
        <>
            <div className={"LeftButton-wrapper"} style={setWrapperStyle()} onClick={()=>{props.changeButtonState(props.index)}}
                onMouseOver={(e)=>{animation.current.style.left = e.pageX -e.currentTarget.offsetLeft + "px"; animation.current.style.top = e.pageY - e.currentTarget.offsetTop + "px";}}
                onMouseOut={(e)=>{animation.current.style.left = e.pageX - e.currentTarget.offsetLeft+ "px"; animation.current.style.top = e.pageY - e.currentTarget.offsetTop+ "px";}}
            >
                <div ref={animation} 
                />
                <span className={setTextClass()}>
                    <FontAwesomeIcon className='LeftButton-icon' icon={props.source.icon}/>
                    <span>{props.source.name}</span>
                </span>
                <span className={setBackgroundColor()}></span>
            </div>
            
        </>
    )
}