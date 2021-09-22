import React, { useEffect } from 'react';
import './FileNameComp.css';

export default function FileNameComp(props){    
    return(
        <>
            <div className='filename-component'>
                <div className='filename-component-header'>
                    <h3>
                        {props.header}
                    </h3>
                </div>
                <div className='filename-component-filename' onClick={props.onClick}>
                    <h4>
                        {props.fileName}
                    </h4>
                </div>
            </div>
        </>
    )
}