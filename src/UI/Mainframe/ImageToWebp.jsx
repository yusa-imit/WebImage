import React from 'react'
import sharp from 'sharp'
import './ImageToWebp.css'

export default function ImageToWebp(props){
    return (
        <>
            
        </>
    )
}

const availableFormat = ['jpeg', 'png','webp', 'avif','tiff', 'gif', 'heif']

function sharpConvert(file, format){
    const data = await sharp(file)
    .toFormat(format)
    .toFile();
    return data;
}