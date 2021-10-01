import React from 'react';
import './Loading.css';

/**
 * Loading Component
 * @param {*} props 
 * @returns 
 */
export default function Loading(props){
    return(
        <>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </>
    )
}