import React, { useEffect, useState } from 'react';
import './ImageOptimizer.css';
import { dropEventListener, dragOverListener, dragEnterListener, dragLeaveListner } from './dragAndDropListners';
import FileNameComp from './Component/FileNameComp.jsx';
import ButtonComp from './Component/ButtonComp.jsx';
import { faChevronDown, faQuestionCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { DelayInput } from 'react-delay-input';
import TooltipText from './Component/TooltipText.jsx';
import DragGuide from './Component/DragGuide.jsx';


//
// ImageOptimizer.jsx
//
// Screen for Image Optimizer
// props : none
export default function ImageOptimizer(props) {
    const { promisify } = require('util');
    //Get Remote for dialog
    const dialog = require('electron').remote.dialog;
    //Only Image Variables
    const fileFilter = [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
    //State
    //Set file to Optimize
    const [file, setFile] = useStateWithCallbackLazy('Please Select Image File To Optimize');
    //function getFile = On get file Button Event Listner
    const getFile = (dragpath = '') => {
        console.log(file);
        var filepath = [];
        if (dragpath !== '') {
            filepath[0] = dragpath;
            setFile(filepath[0], (f) => { getSizeOf(f); setSize(getFileSize(f)); setFileSize(getFileSize(f)); })
            initialize();
        }
        else {
            filepath = dialog.showOpenDialogSync({ filters: fileFilter, properties: ['openFile'] })
            if (filepath === undefined) {
                setFile('Canceled');
                initialize();
                return;
            }
            else {
                setFile(filepath[0], (f) => { getSizeOf(f); setSize(getFileSize(f)); setFileSize(getFileSize(f)) })
                initialize();
            }
        }

    }
    //if file selection was canceled then call this function
    const initialize = () => {
        setConverted('')
        setSize(0)
        setConvSize(0)
    }

    //State width, height
    //set itself when file selected.
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const sizeOf = promisify(require('image-size'))
    const getSizeOf = (f) => {
        sizeOf(f)
            .then(dimensions => { setWidth(dimensions.width); setHeight(dimensions.height); })
            .catch(err => console.error(err))
    }
    //State size
    //set itself when file selected
    const [size, setSize] = useState(0);
    //State with custom input
    const [sizeSelection, setSizeSelection] = useState('KB');
    const [sizeSelectionClick, setSizeSelectionClick] = useState(false);
    //Input click handler
    const onSelectClick = () => {
        if (sizeSelectionClick === false) {
            return;
        }
        return (<>
            <div className='option-wrapper'>
                <div className='option' onClick={() => { if (sizeSelection === 'KB') { return; } setSize(size * 1024); setSizeSelection('KB'); setSizeSelectionClick(false) }}>
                    <p>KB</p>
                </div>
                <div className='option' onClick={() => { if (sizeSelection === 'MB') { return; } setSize(size / 1024); setSizeSelection('MB'); setSizeSelectionClick(false) }}>
                    <p>MB</p>
                </div>
            </div>
        </>)
    }
    //State with original file size and converted file size
    const [fileSize, setFileSize] = useState(0);
    const [convSize, setConvSize] = useState(0);
    //Image Conversion Function.
    const convert = (fileName) => {
        console.log(fileName)
        const extensions = fileName.split('.')[fileName.split('.').length - 1];
        const type = extensions === 'png' ? 'image/png' : extensions === 'gif' ? 'image/gif' : 'image/jpeg';
        const imageConversion = require('image-conversion');
        var url = ''
        imageConversion.urltoBlob(fileName)
            .then(res => {
                var config = (scale === 100 ? {
                    size: sizeSelection === 'KB' ? size : size / 1024,
                    accuracy: 0.9,
                    type: type,
                    width: width,
                    height: height,
                } :
                    {
                        size: sizeSelection === 'KB' ? size : size / 1024,
                        accuracy: 0.9,
                        type: type,
                        width: width,
                        height: height,
                        scale: scale / 100,
                    })
                imageConversion.compressAccurately(res, config)
                    .then(res => {
                        //url=URL.createObjectURL(res);
                        setConvSize(res.size / 1024);
                        url = imageConversion.filetoDataURL(res)
                            .then(data => {
                                console.log(data);
                                setConverted(data);
                            })
                            .catch(e => { console.log(e) })
                    })
                    .catch(e => { console.log(e) })
            })
            .catch(e => { console.log(e) })
    }
    //Download Converted Image
    const download = () => {
        const imageConversion = require('image-conversion');
        imageConversion.dataURLtoFile(converted)
            .then(f => {
                imageConversion.downloadFile(f, file);
            })
            .catch(e => { console.log(e) })
    }
    //State converted : Blob url that contains converted image
    const [converted, setConverted] = useState('');
    //State scale : scale value
    const [scale, setScale] = useState(100);
    //State left, right : Image setter state
    const [left, setLeft] = useState(false);
    const [right, setRight] = useState(false);
    const setImageClass = (parameter) => {
        if (parameter) {
            return 'image-opt-error';
        }
        else {
            return 'image-opt-image';
        }
    }
    //State  drage : turns into true when file dragged into the program
    const [drag, setDrag] = useState(false);
    //State error : turns into true when dragged file was not image file
    const [error, setError] = useState(false);
    /*
    //drag guide
    const dragGuideSetter = () => {
        if (drag) {
            return (
                <div className='drag-guide'>
                    <div className='dots'>
                        <h2>Drag file into here!</h2>
                    </div>
                </div>
            )
        }
        else {
            return
        }
    }

    //error guide
    const errorGuideSetter = () =>{
        if(error){
            return (
                <div className='error-guide' onClick={()=>{setError(false)}}>
                    <h1><FontAwesomeIcon className='alert-icon' icon={faExclamationTriangle}></FontAwesomeIcon></h1>
                    <h2>It seems like this is not a image file!</h2>
                    <h5>Click this message to get back</h5>
                </div>
            )
        }
    }
    */
    return (<>
        <div className='img-opt-wrapper'>
            <div className='img-opt-filedir'>
                <FileNameComp header={'Image'} fileName={file} onClick={() => { getFile(); }} />
            </div>
            <div className='img-opt-buttons'>
                <div className='img-opt-size'>
                    <div className='title-container'><h5> Size </h5> <TooltipText text={'Program will convert image fit to the size you want to set. \n Size factor will always working.'} /></div>
                    <div className='input-wrapper'>
                        <DelayInput delayTimeout={500} type="number" min={1} value={parseFloat(parseFloat(size).toFixed(1))} onChange={(e) => { setSize(e.target.value); console.log(size) }} />
                        <div className={sizeSelectionClick === false ? 'select' : 'select-action'} onClick={() => { setSizeSelectionClick(sizeSelectionClick === true ? false : true) }}>
                            <p>{sizeSelection}</p>
                            <FontAwesomeIcon className='chevron-down' icon={faChevronDown} />
                            {onSelectClick()}
                        </div>
                    </div>
                </div>
                <div className='img-opt-adjust'>
                    <div className='title-container'><h5> Adjust <br /> Width, Height</h5><TooltipText text={'You can adjust image\'s width and height by hand.'} /></div>
                    <div className='input-wrapper'>
                        <div className='labeled-wrapper'>
                            <h6>Height</h6>
                            <DelayInput forceNotifyByEnter={true} delayTimeout={500} type="number" min={0} value={height.toFixed(0)} step='' onChange={(e) => { setHeight(parseInt(e.target.value)) }} />
                        </div>
                        <div className='labeled-wrapper'>
                            <h6>Width</h6>
                            <DelayInput forceNotifyByEnter={true} delayTimeout={500} type="number" min={0} value={width.toFixed(0)} step='' onChange={(e) => { setWidth(parseInt(e.target.value)) }} />
                        </div>
                    </div>
                </div>
                <div className='img-opt-scale'>
                    <div className='title-container'><h5>Image Scale </h5> <TooltipText text={'You can scale your image. \n If image scale is not 100% Program will ignore adjusted numbers of width and height.'} /></div>
                    <div className='labeled-wrapper'>
                        <DelayInput delayTimeout={500} type="number" min={0} max={999} value={scale.toFixed(0)} step='' onChange={(e) => { setScale(parseInt(e.target.value)) }} />
                        <h3>%</h3>
                    </div>
                </div>
                <div className='img-opt-confirm'>
                    <div className='button-div'>
                        <ButtonComp text={'Convert'} backgroundColor={'#dc143c'} handleClick={() => { convert(file) }} />
                    </div>
                    <div className='button-div'>
                        <ButtonComp text={'Save'} backgroundColor={'#3cb712'} handleClick={() => { download() }} />
                    </div>

                </div>
            </div>
            <div className='img-opt-stats'>
                <div className='stat-child'>
                    <div className='image-container'>
                        <img className={setImageClass(left)} src={file === 'Canceled' || file === 'Please Select Image File To Optimize' ? '' : file} onLoad={() => { setLeft(false) }} onError={() => { setLeft(true) }} />
                    </div>
                    <div className='image-detail'>
                        <h4>{fileSize.toFixed(2)}</h4><h4>{' KB'}</h4>
                    </div>
                </div>
                <div className='stat-child'>
                    <div className='image-container'>
                        <img className={setImageClass(right)} src={converted} onLoad={() => { setRight(false) }} onError={() => { setRight(true) }} />
                    </div>
                    <div className='image-detail'>
                        <h4>{convSize.toFixed(2)}</h4><h4>{' KB'}</h4>
                    </div>
                </div>
                <div className='drag-setter'>
                <DragGuide drag={drag}/>
                </div>
            </div>
        </div>
        
        <div className='drag-and-drop-area'
            onDrop={(e) => {
                dropEventListener(e, (p) => {
                    var extension = p.split('.')[p.split('.').length - 1];
                    var acceptables = ['jpg', 'jpeg', 'png', 'gif'];
                    if (!acceptables.includes(extension)) {
                        setDrag(false);
                        props.setError(true);
                        props.setErrorText("Image format not supported");
                        initialize();
                        return;
                    }
                    setDrag(false);
                    getFile(p);
                })
            }}
            onDragOver={dragOverListener}
            onDragEnter={(e) => { dragEnterListener(e, () => { setDrag(true) }) }}
            onDragLeave={(e) => { dragLeaveListner(e, () => { setDrag(false) }) }}
            onClick={() => { setSizeSelectionClick(false) }}
        >
            
        </div>
        
    </>);
}

// FS functions
function getFileSize(f) {
    var fs = require('fs');
    var stats = fs.statSync(f);
    var fileSizeInKiloBytes = stats.size / 1024;
    return fileSizeInKiloBytes;
}