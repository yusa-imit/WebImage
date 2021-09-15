import React, {useState} from 'react';
import './ImageViewer.css';

export default function ImageViewer(props){
    const [show, setShow] = useState(false)
    return(
        <>
            <img src={img}/>
        </>
    )
}