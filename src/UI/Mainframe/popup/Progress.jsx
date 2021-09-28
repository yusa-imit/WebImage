import React from 'react';
import './Progress.css';
import ButtonComp from '../Component/ButtonComp.jsx';
import { Line } from 'rc-progress'

export default function Progress(props) {
    const cancelButtonColor = '#dc143c'
    const closeButtonColor ='#3cb712'
    const closeButtonFunction = props.onCloseClick
    const message = props.progress === props.total ? "DONE!" : props.message;
    return (
        <>
            <div className="progress-background-wrapper">
                <div className="progress-background">

                </div>
                <div className="progress-wrapper">
                    <div className="progress-message-container">
                        <div className='progress-message-title'>
                            <h4>Working on progress</h4>
                        </div>
                        <RippleAnimationComp/>
                        <h6>{message}</h6>
                    </div>
                    <div className="progress-progressbar-container">
                        <h5>{props.progress}/{props.total}</h5>
                        <Line percent={props.total === 0 ? 0 : ((props.progress / props.total) * 100).toFixed(0)} strokeWidth='2' trailWidth='2' />
                    </div>
                    <div className="progress-button-container">
                        <ButtonComp text={"Cancel"} textColor={'#fdf5e6'} backgroundColor={cancelButtonColor} handleClick={props.onCalcelClick} disable={props.progressCancel===true?false:true}/>
                        <ButtonComp text={"Close"} textColor={'#fdf5e6'} backgroundColor={closeButtonColor} handleClick={closeButtonFunction} disable={props.progressCancel===true?true:false}/>
                    </div>
                </div>
            </div>
        </>
    )
}

const RippleAnimationComp = (props) => {
    return (<>
        <div className={"loadingio-spinner-ripple-g8m4kw5bmbw"} ><div className="ldio-6pzj0lbar02">
            <div></div><div></div>
        </div></div>
    </>)
}


/*<Line percent={files.length === 0 ? 0 : ((progress / files.length) * 100).toFixed(0)} className='progress-bar-comp'
                                strokeWidth='2' trailWidth='2'
                            />
                            
                            */