import React from 'react';
import './ErrorGuide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
export default function ErrorGuide(props) {
    const text = props.text === undefined ? "Error Occured" : props.text;
    const error = props.error === undefined ?false : props.error;
    if (error) {
        return (
            <>
                <div className="error-backdrop">
                    <div className='error-guide' onClick={props.onClick}>
                        <h1><FontAwesomeIcon className='alert-icon' icon={faExclamationTriangle}></FontAwesomeIcon></h1>
                        <h2>{text}</h2>
                        <h5>Click this message to get back</h5>
                    </div>
                </div>
            </>
        )
    }
    else {
        return <></>
    }
}