import React, { useState, useEffect, useRef } from 'react'
import './ImageToWebp.css'
import { dragEnterListener, dragLeaveListner, dragOverListener, dropEventListener } from './dragAndDropListners.js'
import { sharpConvertAndExport } from './sharpFunction.js'
import ButtonComp from './Component/ButtonComp.jsx'
import Scrollbars from 'react-custom-scrollbars'
import ImageViewer from './Component/ImageViewer.jsx'
import FileNameComp from './Component/FileNameComp.jsx'
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

export default function ImageToWebp(props) {
    const [info, setInfo] = useState([]);
    const [convertInto, setConvertInto] = useState('webp');
    //Get Remote for dialog
    const dialog = require('electron').remote.dialog;
    const availableFormat = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'gif', 'heif']
    const buttons = [{ 'title': 'JPEG', 'data': 'jpeg' },
    { 'title': 'PNG', 'data': 'png' },
    { 'title': 'WEBP', 'data': 'webp' },
    { 'title': 'AVIF', 'data': 'avif' },
    { 'title': 'TIFF', 'data': 'tiff' },
    { 'title': 'GIF', 'data': 'gif' },
    { 'title': 'HEIF', 'data': 'heif' }]
    const setButtons = () => {
        return (
            buttons.map((button) => (
                <ButtonComp text={button.title} key={button.title} backgroundColor={button.data === convertInto ? '#dc143c' : 'transparent'} textColor={'#fdf5e6'} handleClick={() => { setConvertInto(button.data) }} />
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
    const increaseProgress = () =>{
        setProgress(prevProg => prevProg+1);
    }
    const [files, setFiles] = useState([]);
    //Only Image Variables
    const fileFilter = [{ name: 'Images', extensions: availableFormat }]
    //function getFile = On get file Button Event Listner
    const getFile = () => {
        dialog.showOpenDialog({ filters: fileFilter, properties: ['openFile', 'multiSelections', 'showHiddenFiles',] })
            .then(
                result => {
                    if (result.canceled === true) {
                        
                    }
                    else {
                        for (var file of result.filePaths) {
                            if (files.includes(file))
                                continue;
                            if (formatConfirm(file)) {
                                setFiles(prevfiles => [...prevfiles, file]);
                            }
                        }
                    }
                }
            )
            .catch(e => {
                console.log(e);
            })
    }
    const [target, setTarget] = useState('Default');
    const getTargetDirectory = () => {
        const dir = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        })
        if (dir === undefined) {
            setTarget('Default');
        }
        else {
            setTarget(dir);
        }
    }
    const convert = (f) => {
        sharpConvertAndExport(f, convertInto, target, setInfo, increaseProgress)
    }
    const convertAll = () => {
        for (var file of files) {
            convert(file);
        }
    }
    const initialize = () => {
        setInfo([]);
        setFiles([]);
        setProgress(0);
    }
    const scroll = useRef();
    useEffect(() => { console.log(progress)}, [files, progress])
    return (
        <>
            <div className='mainframe-wrapper'>
                <div className='webp-wrapper'>
                    <div className='webp-image-div' onClick={() => { }}>
                        <Scrollbars ref={scroll} autoHide={true} className='webp-scroll'>
                            <div className='webp-image-container'>
                                {
                                    files.map((file, index) => (
                                        <ImageViewer file={file} key={index} />
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
                    <div className='webp-result'>
                        <div className='target-dest'>
                            <FileNameComp header={'Result Destination'} fileName={target} onClick={() => { getTargetDirectory() }} />
                        </div>
                        <div className='progress-bar'>
                            <h5 style={{ marginRight: '20px' }}>Progress</h5>
                            <Progress symbolClassName={'progress-bar-comp'} percent={files.length === 0 ? 0 : ((progress / files.length) * 100).toFixed(0)} theme={{
                                active: {
                                    color: '#fdf5e6',
                                }
                            }} />
                        </div>
                        <div className='convert-button'>
                            <div className='button-wrapper'>
                                <ButtonComp text={'RESET FILE'} backgroundColor={'#3cb712'} textColor={'#fdf5e6'} handleClick={() => { initialize() }} />
                            </div>
                            <div className='button-wrapper'>
                                <ButtonComp text={'CONVERT'} backgroundColor={'#dc143c'} textColor={'#fdf5e6'} handleClick={() => { convertAll() }} />
                            </div>


                        </div>
                    </div>
                </div>
                <div className='drag-and-drop-area'
                    onDrop={(e) => {
                        dropEventListener(e, (f) => {
                            
                            if (isDirectory(f)) {
                                var dirFiles = getDirectoryFiles(f);
                                var fileArr = [];
                                for (var file of dirFiles) {
                                    if(files.includes(file))
                                        continue;
                                    if(fileArr.includes(file))
                                        continue;
                                    if (formatConfirm(file)) {
                                        fileArr.push(f+'\\'+file);
                                    }
                                }
                                setFiles(prevfiles => [...prevfiles, ...fileArr]);
                            }
                            else {
                                if (formatConfirm(f)) {
                                    if (files.includes(f))
                                        return;
                                    setFiles([...files, f]);
                                }
                            }
                        })
                    }}
                    onDragOver={dragOverListener}
                    onDragEnter={(e) => { dragEnterListener(e, () => { setDrag(true) }) }}
                    onDragLeave={(e) => { dragLeaveListner(e, () => { setDrag(false) }) }}
                    onClick={() => {  }}

                    onWheel={(e) => { scroll.current.scrollTop(scroll.current.getScrollTop() + e.deltaY) }}
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