import React from 'react'
import './VideoToWebm.css'
import {getMetaData, getFfmpegAvailables, ffmpegProcess} from '../lib/ffmpeg.js';

export default function ImageToWebm(props) {
    let FFMPEG_AVAILABLE;
    getFfmpegAvailables().then(data=>{
        FFMPEG_AVAILABLE=data;
        console.log(data)
    })

    getMetaData('C:/Users/esimi/Downloads/test.mp4').then(data=>{
        console.log(data);
    })
    return(
        <>
        <div>
            {FFMPEG_AVAILABLE}
        </div>
        </>
    )
}