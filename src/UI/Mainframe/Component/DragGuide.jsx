import React from 'react';
import './DragGuide.css';


/**
 * Guide component for drag
 * @param {drag} props 
 * drag : boolean : when true, drag component will displayed
 * @returns React Component
 */
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