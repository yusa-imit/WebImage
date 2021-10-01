import React, { useEffect } from 'react';
import './FileNameComp.css';

/**
 * File getter ui component
 * @param {disableHeader, className, fileName, onClick} props 
 * disableHeader : boolean : when true, disable header child
 * className : string : set className of the component
 * fileName : string: set file name of the main text component
 * onClick : function : event handler for click
 * @returns 
 */
export default function FileNameComp(props){    
    const disableHeader = props.disableHeader===undefined?false:props.disableHeader;
    const className = props.className===undefined?'filename-component':'filename-component'+' '+props.className;
    const setHeaderLength = () =>{
        if(disableHeader){
            return {width:0}
        }
        else{
            return{}
        }
    }
    const setFileNameLength = () =>{
        if(disableHeader){
            return {width:'100%'}
        }
        else{
            return {}
        }
    }
    return(
        <>
            <div className={className}>
                <div className='filename-component-header' style={setHeaderLength()}>
                    <h3>
                        {props.header}
                    </h3>
                </div>
                <div className='filename-component-filename' onClick={props.onClick} style={setFileNameLength()}>
                    <h4 className='file-name-text'>
                        {props.fileName}
                    </h4>
                </div>
            </div>
        </>
    )
}