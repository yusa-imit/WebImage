import React from 'react';
import './ErrorGuide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

/**
 * error guide component
 * @param {text, error, onClick} props 
 * text: string : text for main error message
 * error : boolean : if error is true, error popup is displayed
 * onClick : function : handler for onClick
 * @returns 
 */
export default function ErrorGuide(props) {
    const text = props.text === undefined ? "Error Occured" : props.text;
    const error = props.error === undefined ? false : props.error;
    const guideClassName = error ? "error-guide" : "error-guide-min";
    const backdropClassName = error ? "error-backdrop" : "error-backdrop-min";
    return (
        <>
            <div className={backdropClassName}>
                <div className={guideClassName} onClick={props.onClick}>
                    <h1><FontAwesomeIcon className='alert-icon' icon={faExclamationTriangle}></FontAwesomeIcon></h1>
                    <h2>{text}</h2>
                    <h5>Click this message to get back</h5>
                </div>
            </div>
        </>
    )


}