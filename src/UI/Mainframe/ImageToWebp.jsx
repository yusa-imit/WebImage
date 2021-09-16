import React, { useState, useEffect, useRef } from 'react'
import './ImageToWebp.css'
import { dragEnterListener, dragLeaveListner, dragOverListener, dropEventListener } from './dragAndDropListners.js'
import { sharpConvertAndExport } from './sharpFunction.js'
import ButtonComp from './Component/ButtonComp.jsx'
import Scrollbars from 'react-custom-scrollbars'
import ImageViewer from './Component/ImageViewer.jsx'

export default function ImageToWebp(props) {
    const [info, setInfo] = useState([]);
    const [convertInto, setConvertInto] = useState('WEBP');
    const changeInfo = (num) => {

    }
    //Get Remote for dialog
    const dialog = require('electron').remote.dialog;
    const availableFormat = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'gif', 'heif']
    const buttons = ['JPEG', 'PNG', 'WEBP', 'AVIF', 'TIFF', 'GIF', 'HEIF']
    const setButtons = () =>{
        return (
            buttons.map((button)=>(
                    <ButtonComp text={button} key={button} backgroundColor={button===convertInto?'#dc143c':'transparent'} textColor={'#fdf5e6'} handleClick={() => {setConvertInto(button)}} />
        ))
        );
    }
    const formatConfirm = (f) => {
        var extension = f.split('.')[f.split('.').length - 1];
        if (!availableFormat.includes(extension)) {
            return false;
        }
        else {
            return true;
        }
    }
    const [drag, setDrag] = useState(false);
    const [progress, setProgress] = useState(0);
    const [files, setFiles] = useState([]);
    //Only Image Variables
    const fileFilter = [{ name: 'Images', extensions: availableFormat }]
    //function getFile = On get file Button Event Listner
    const getFile = () => {
        dialog.showOpenDialog({ filters: fileFilter, properties: ['openFile', 'multiSelections', 'showHiddenFiles',] })
        .then(
            result => {
                if (result.canceled === true) {                    
                    setFiles([])
                }
                else {
                    for (var file of result.filePaths) {
                        if(files.includes(file))
                                continue;
                        if (formatConfirm(file)) {
                            setFiles(prevfiles=>[...prevfiles, file]);        
                        }
                    }
                }
            }
        )
        .catch(e=>{
            console.log(e);
        })
    }
    const customDropEventListener=(e)=>{
        e.preventDefault();
        e.stopPropagation();
        for(const f of e.dataTransfer.files){
            func(f.path);
        }
    }
    
    const convert = () => {
        sharpConvertAndExport('C:\\Users\\esimi\\Downloads\\E8guACLVkAQV6-j.jpeg', 'webp', setInfo)
    }
    const scroll = useRef();
    const detector = useRef();
    
    return (
        <>
            <div className='mainframe-wrapper' onClick={() => { convert() }}>
                <div className='webp-wrapper'>
                    <div className='webp-image-div' onClick={() => { getFile() }}>
                        <Scrollbars ref={scroll} autoHide={true} className='webp-scroll'>
                            <div  className='webp-image-container'>
                                {
                                    files.map((file, index)=>(
                                        <ImageViewer file={file} key={index}/>
                                    ))
                                }
                            </div>
                        </Scrollbars>
                    </div>
                    <div className='webp-button-wrapper'>

                            <ButtonComp text={'Add File'} backgroundColor={'#3cb712'} textColor={'#fdf5e6'} handleClick={() => { getFile() }} />

                        {
                            setButtons()
                        }
                    </div>
                    <div className='webp-progress-bar'>

                    </div>
                </div>
                <div className='drag-and-drop-area' ref={detector}
                    onDrop={(e) => {
                        dropEventListener(e, (f) => {
                            if (isDirectory(f)) {
                                var dirFiles = getDirectoryFiles(f);
                                for (var file of dirFiles) {
                                    console.log(file)
                                    if(files.includes(f+'\\'+file)){
                                        continue;
                                    }
                                    if (formatConfirm(file)) {
                                        setFiles([...files, f + '\\' + file]);
                                    }
                                }
                            }
                            else {
                                if (formatConfirm(f)) {
                                    if(files.includes(f))
                                            return;
                                    setFiles([...files, f]);
                                }
                            }
                            /*
                            var extension = p.split('.')[p.split('.').length - 1];
                            var acceptables = ['jpg', 'jpeg', 'png', 'gif'];
                            if (!acceptables.includes(extension)) {
                                setDrag(false);
                                setError(true);
                                initialize();
                                return;
                            }
                            setDrag(false);
                            getFile(p);*/
                        })
                    }}
                    onDragOver={dragOverListener}
                    onDragEnter={(e) => { dragEnterListener(e, () => { setDrag(true) }) }}
                    onDragLeave={(e) => { dragLeaveListner(e, () => { setDrag(false) }) }}
                    onClick={() => {console.log("click")}}
                    
                    onWheel={(e)=>{scroll.current.scrollTop(scroll.current.getScrollTop()+e.deltaY)}}
                >

                </div>
            </div>
        </>
    )
}

function isDirectory(f) {
    var fs = require('fs');
    return fs.statSync(f).isDirectory();
}

function getDirectoryFiles(f) {
    var fs = require('fs');
    return fs.readdirSync(f);
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


    function ImageSetter(props){
        const files = props.files;
        const setImageComp = () =>{
            if(files === []){
                return (
                    <>
                    </>
                );
            }
            else{
                console.log('files::::')
                console.log(files[0])
                return(
                    files.map((file)=>(
                        <ImageViewer file={file}/>
                    ))
                )
            }
        }
        return(
            <>
            {setImageComp()}
            </>
        )
    }