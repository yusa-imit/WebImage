import React from 'react';
import './ButtonComp.css';

/**
 * Overall button component
 * @param {disable, backgroundColor, textColor, text} props 
 * disable : boolean : when true, disable button
 * backgroundColor : string : background color setter, if undefined, set background color for transparent
 * textColor : string : text color setter, if undefined, set text color for transparent
 * text : string : button text
 * @returns 
 */
export default function ButtonComp(props){
    const disable = props.disable===undefined?false:props.disable;
    const bg = props.backgroundColor===undefined?'transparent':disable===false?props.backgroundColor:'#3B3B3B';
    const textColor = props.textColor===undefined?'#000000':disable===false?props.textColor:'#868686';
    return(<>
        <div className='button-comp' style={{backgroundColor:bg, color:textColor}} onClick={()=>{if(disable){return}; props.handleClick()}}>
            <div className='button-comp-text'>
                <h4>
                    {props.text}
                </h4>
            </div>
        </div>
    </>);
}