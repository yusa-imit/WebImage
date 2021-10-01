import React, {useState} from 'react';
import './ImageViewer.css';

/**
 * Image previewer component
 * @param {file} props 
 * file : string : get file string from fs
 * @returns 
 */
export default function ImageViewer(props){
    const [show, setShow] = useState(false)
    return(
        <>
            <div className='image-viewer-container'>
                <img className='image-viewer' src={props.file} onLoad={console.log(props.file)}/>
            </div>
        </>
    )
}