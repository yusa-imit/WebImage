import React from 'react';
import './DragGuide.css';

export default function DragGuide(props){
    if (props.drag) {
        return (
            <div className='drag-guide'>
                <div className='dots'>
                    <h2>Drag file into here!</h2>
                </div>
            </div>
        )
    }
    else {
        return <></>
    }
}