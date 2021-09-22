import React from 'react';
import './TooltipText.css';
import {faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function TooltipText(props){
    return(
        <div className='tooltip' style={props.style}>
            <FontAwesomeIcon  icon={faQuestionCircle}/>
            <div className='tooltipText'>
                <h5>
                    {props.text}
                </h5>
            </div>
        </div>
    )
}