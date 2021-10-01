import React, { useState, useEffect, useRef } from 'react'
import './ImageToWebp.css'
import { dragEnterListener, dragLeaveListner, dragOverListener, dropEventListener } from './dragAndDropListners.js'
import { sharpConvertAndExport } from './sharpFunction.js'
import ButtonComp from './Component/ButtonComp.jsx'
import Scrollbars from 'react-custom-scrollbars'
import ImageViewer from './Component/ImageViewer.jsx'
import FileNameComp from './Component/FileNameComp.jsx'
import DragGuide from './Component/DragGuide.jsx';
import { Line } from 'rc-progress'
import {getSync} from '../settings.js'

/**
 * 
 * @param {setIsProgress, setProgressWindow,
 * setProgressTotal, setProgressMessage
 * progressCancel, setProgressCancle, setError, setErrorText
 * } props 
 * setIsProgress : function : setter function of isProgress state, calls when progress start
 * setProgressWindow : function : setter function of progressWindow state, calls when progress staged
 * setProgressTotal : function : setter function of progressTotal state, calls when set total progress' length
 * setProgressMessage : function : setter function of progressMessage state, calls when change console message of progress pop-up
 * progressCancel : boolean : value of progressCancel state
 * setProgressCancel : function : setter function of setProgressCancel state, calls when progress is cancelled
 * setError : function : setter function of error state, calls when error occured
 * setErrorText : function : setter function of errorText state, calls when change console message of error pop-up
 * @returns 
 */
export default function ImageToWebp(props) {
    // state info : contains information of image
    const [info, setInfo] = useState([]);
    // state convertInto : contains output format of converted image
    const [convertInto, setConvertInto] = useState('webp');
    // Get Remote for dialog
    const dialog = require('electron').remote.dialog;
    // Formats available
    const availableFormat = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'gif', 'heif']
    // All buttons
    const buttons = [{ 'title': 'JPEG', 'data': 'jpeg' },
    { 'title': 'PNG', 'data': 'png' },
    { 'title': 'WEBP', 'data': 'webp' },
    { 'title': 'AVIF', 'data': 'avif' },
    { 'title': 'TIFF', 'data': 'tiff' },
    { 'title': 'GIF', 'data': 'gif' },
    { 'title': 'HEIF', 'data': 'heif' }]
    // setter function of buttons
    const setButtons = () => {
        return (
            buttons.map((button) => (
                <ButtonComp text={button.title} key={button.title} backgroundColor={button.data === convertInto ? '#dc143c' : 'transparent'} textColor={'#fdf5e6'} handleClick={() => { setConvertInto(button.data) }} />
            ))
        );
    }
    // confirm its format is correct
    const formatConfirm = (f) => {
        var extension = f.split('.')[f.split('.').length - 1];
        if (!availableFormat.includes(extension)) {
            return false;
        }
        else {
            return true;
        }
    }
    // state drag : when true, file drag is enabled
    const [drag, setDrag] = useState(false);
    // state progress : progress
    // depleted?
    // todo : delete depleted state
    const [progress, setProgress] = useState(0);

    // calls when progress is proceeded
    const increaseProgress = () => {
        setProgress(prevProg => prevProg + 1);
        props.setProgressWindow(prevProg=>prevProg + 1);
        props.setProgressMessage("Processing Images")
    }

    // files state : array state that contains all files to convert
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
    // state target : output directory
    const [target, setTarget] = useState(getSync('defaultStorage'));
    // get target directory from dialog
    const getTargetDirectory = () => {
        const dir = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        })
        if (dir === undefined) {
            setTarget(getSync('defaultStorage'));
        }
        else {
            setTarget(dir);
        }
    }
    // convert function
    const convert = (f) => {
        sharpConvertAndExport(f, convertInto, target, setInfo, increaseProgress)
    }

    // convert everything in files state
    const convertAll = () => {
        if(files.length===0){
            return;
        }
        setWorking(true);
        props.setProgressCancel(true);
        props.setIsProgress(true);
        props.setProgressTotal(files.length);
        for (var file of files) {
            convert(file);
            if(props.progressCancel===false&& progress!==0){
                props.setProgressMessage("Cancelled")
                break;
            }
            if(files.length===progress){
                props.setProgressCancel(false);
            }
        }
    }

    // state initializer
    const initialize = () => {
        setInfo([]);
        setFiles([]);
        setProgress(0);
    }

    // ref for scrolling
    const scroll = useRef();
    // if it is processing, disable buttons
    const [working, setWorking] = useState(false);
    const setConvertButton = () => {

        if (working) {
            return (
                <ButtonComp text={'PROCESSING'} backgroundColor={'#0f0f0f'} textColor={'#fdf5e6'} handleClick={() => { }} />
            )
        }
        else {
            return (
                <ButtonComp text={'CONVERT'} backgroundColor={'#dc143c'} textColor={'#fdf5e6'} handleClick={() => { convertAll(); setProgress(0); }} />
            )
        }
    }
    //useEffect for progress working
    useEffect(() => {
        console.log(progress);
        if (progress === files.length) {
            setWorking(false)
        }
    }, [files, progress])
    return (
        <>
            <div className='mainframe-wrapper'>
                <div className='webp-wrapper'>
                    <div className='webp-image-div' onClick={() => { }}>
                        <Scrollbars ref={scroll} autoHide={true} className='webp-scroll'>
                            <div className='webp-image-container'>
                                {
                                    files.map((file, index) => (
                                        <ImageViewer file={file} key={index} info={info[file]} />
                                    ))
                                }
                            </div>
                        </Scrollbars>
                        <div className='webp-drag-setter'>
                            <DragGuide drag={drag}/>
                        </div>
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
                        <div className='convert-button'>
                            <div className='button-wrapper'>
                                <ButtonComp text={'RESET FILE'} backgroundColor={'#3cb712'} textColor={'#fdf5e6'} handleClick={() => { initialize() }} />
                            </div>
                            <div className='button-wrapper'>
                                {setConvertButton()}
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
                                    if (files.includes(file))
                                        continue;
                                    if (fileArr.includes(file))
                                        continue;
                                    if (formatConfirm(file)) {
                                        fileArr.push(f + '\\' + file);
                                    }
                                }
                                setFiles(prevfiles => [...prevfiles, ...fileArr]);
                                setDrag(false);
                            }
                            else {
                                if (formatConfirm(f)) {
                                    if (files.includes(f)){
                                        setDrag(false);
                                        return;
                                    }
                                    setFiles(prevfiles => [...prevfiles, f]);
                                }
                            }
                        })
                    }}
                    onDragOver={dragOverListener}
                    onDragEnter={(e) => { dragEnterListener(e, () => { setDrag(true) }) }}
                    onDragLeave={(e) => { dragLeaveListner(e, () => { setDrag(false) }) }}
                    onClick={() => { }}

                    onWheel={(e) => { scroll.current.scrollTop(scroll.current.getScrollTop() + e.deltaY) }}
                >

                </div>
            </div>
        </>
    )
}


/**
 *  File System Functions
 * 
 */
function isDirectory(f) {
    var fs = require('fs');
    return fs.statSync(f).isDirectory();
}

function getDirectoryFiles(f) {
    var fs = require('fs');
    return fs.readdirSync(f);
}