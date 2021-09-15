import React , {useState}from 'react'
import './ImageToWebp.css'
//import sharp from 'sharp'
import {sharpConvert, sharpToFile} from './sharpFunction.js'
export default function ImageToWebp(props){
    const [img, setImg] = useState('');
    const availableFormat = ['jpeg', 'png','webp', 'avif','tiff', 'gif', 'heif']
    const sharp = require('sharp');
    const imageConversion = require('image-conversion');
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
        }
    )
    
    
    return (
        <>
            <div>
                <img src={img}></img>
            </div>
        </>
    )
}



