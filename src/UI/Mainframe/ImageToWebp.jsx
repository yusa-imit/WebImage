import React , {useState}from 'react'
import './ImageToWebp.css'

import {sharpConvertAndExport} from './sharpFunction.js'
export default function ImageToWebp(props){
    const [img, setImg] = useState('');
    const [info, setInfo] = useState([]);
    const changeInfo = (num) =>{
        
    }
    const availableFormat = ['jpeg', 'png','webp', 'avif','tiff', 'gif', 'heif']
    const sharp = require('sharp');
    const imageConversion = require('image-conversion');
    const [drag, setDrag] = useState(false);
    const [progress, setProgress] = useState(0);
    const [files, setFiles] = useState([]);
    
    const convert = () =>{
        sharpConvertAndExport('C:\\Users\\esimi\\Downloads\\E8guACLVkAQV6-j.jpeg', 'webp', setInfo)
    }
    return (
        <>
            <div onClick={()=>{convert()}}>
                <div className='webp-wrapper'>
                    <div className='webp-image-div'>

                    </div>
                    <div className='webp-button-wrapper'>

                    </div>
                    <div className='webp-progress-bar'>

                    </div>
                </div>
                <div className='drag-and-drop-area'>

                </div>
            </div>
        </>
    )
}





// Dummy for file converting
/*
    sharpConvert('C:\\Users\\esimi\\Downloads\\E8guACLVkAQV6-j.jpeg', 'webp').then(
        buffer=>{
            console.log(buffer)
            //const pixelArray = new Uint8ClampedArray(buffer);
            //console.log(pixelArray)
            const url = imageConversion.filetoDataURL(new Blob([buffer])).then(
                data=>{
                    setImg(data)
                    console.log(data)
                }
            )
            sharp(new Uint8ClampedArray(buffer.buffer)).toFile('C:\\Users\\esimi\\Downloads\\E8guACLVkAQV6-j.webp').then(info=>{console.log(info)});
            //info contains
            //format, width, height, size
        }
    )
    */