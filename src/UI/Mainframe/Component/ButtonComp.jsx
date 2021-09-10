import React from 'react';
import './ButtonComp.css';

export default function ButtonComp(props){
    const bg = props.backgroundColor===undefined?'transparent':props.backgroundColor;
    return(<>
        <div className='button-comp' style={{backgroundColor:bg}} onClick={()=>{props.handleClick()}}>
            <div className='button-comp-text'>
                <h4>
                    {props.text}
                </h4>
            </div>
        </div>
    </>);
}