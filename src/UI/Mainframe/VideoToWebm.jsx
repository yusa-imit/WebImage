import React, { useState, useEffect } from 'react'
import './VideoToWebm.css'
import {killProcess, ffmpegProcess, getMetaData, getFfmpegAvailables } from '../lib/ffmpeg.js';
import Loading from './Component/Loading.jsx';
import ReactPlayer from 'react-player'
import FileNameComp from './Component/FileNameComp.jsx';
import TooltipText from './Component/TooltipText.jsx';
import { DelayInput } from 'react-delay-input';
import { Line } from 'rc-progress'
import ButtonComp from './Component/ButtonComp.jsx';
import { dragEnterListener, dragLeaveListner, dragOverListener, dropEventListener } from './dragAndDropListners.js'
import DragGuide from './Component/DragGuide.jsx'

export default function ImageToWebm(props) {
    let FFMPEG_AVAILABLE;
    const dataPreprocessing = (data) => {
        let audio = { "codecs": {}, "encoders": {} };
        let video = { "codecs": {}, "encoders": {} };
        let encodableFormats = {};
        let decodableFormats = {};
        for (var keys in data.codecs) {
            if (data.codecs[keys].canDecode && data.codecs[keys].canEncode) {
                if (data.codecs[keys].type === "audio")
                    audio.codecs[keys] = data.codecs[keys];
                else
                    video.codecs[keys] = data.codecs[keys];
            }
        }
        for (var keys in data.encoders) {
            if (data.encoders[keys].type === "audio")
                audio.encoders[keys] = data.encoders[keys];
            else
                video.encoders[keys] = data.encoders[keys];
        }
        for (var keys in data.formats) {
            if (data.formats[keys].canDemux) {
                decodableFormats[keys] = data.formats[keys];
            }
            if (data.formats[keys].canMux) {
                encodableFormats[keys] = data.formats[keys];
            }
        }
        return { "audio": audio, "video": video, "encodableFormats": encodableFormats, "decodableFormats": decodableFormats };
    }
    const dialog = require('electron').remote.dialog;
    const [availableFormat, setAvailableFormat] = useState(undefined);
    const fileFilter = [{ name: 'Videos', extensions: availableFormat }]
    const getFile = () => {
        dialog.showOpenDialog({ filters: fileFilter, properties: ['openFile', 'showHiddenFiles',] })
            .then(
                result => {
                    if (result.canceled === true) {

                    }
                    else {
                        console.log(result.filePaths[0]);
                        setVideo(result.filePaths[0]);
                        getVideoInfo(result.filePaths[0]);
                        setFormat(result.filePaths[0].split('.')[result.filePaths[0].split('.').length - 1]);
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
    const getVideoInfo = (dir) => {
        setLoadText("Loading Video Informations");
        setLoad(true);
        const path = require("path");
        getMetaData(path.normalize(dir)).then(data => {
            if (data === undefined) {
                setLoad(false);
                return
            }
            else {
                for (var d of data.streams) {
                    console.log(d)
                    if (isVideoProperty(d)) {
                        setVideoInfo(d);
                    }
                    else {
                        setAudioInfo(d);
                    }
                }
            }
            setLoad(false);



        })
    }
    const isVideoProperty = (data) => {
        if (data.codec_type === "video") {
            return true;
        }
        else {
            return false;
        }
    }
    const setVideoInfo = (data) => {
        setVCodec(data.codec_name);
        setVBit(data.bit_rate);
        setHeight(data.height);
        setWidth(data.width);
        setFps(parseInt(data.r_frame_rate));
        setVOutBit(data.bit_rate);
        setOutHeight(data.height);
        setOutWidth(data.width);
        setOutFps(parseInt(data.r_frame_rate));
        setTotalFrames(parseInt(data.nb_frames));
    }
    const setAudioInfo = (data) => {
        setACodec(data.codec_name);
        setABit(data.bit_rate);
        setAOutBit(data.bit_rate);
    }
    const [encodableFormats, setEncodableFormats] = useState('');
    const [audioCodecs, setAudioCodecs] = useState('');
    const [videoCodecs, setVideoCodecs] = useState('');
    const setFfmpegInfo = () => {
        getFfmpegAvailables().then(data => {
            FFMPEG_AVAILABLE = dataPreprocessing(data);
            console.log(FFMPEG_AVAILABLE);
        })
            .then(() => {
                setAvailableFormat(Object.keys(FFMPEG_AVAILABLE.decodableFormats));
                setEncodableFormats(Object.keys(FFMPEG_AVAILABLE.encodableFormats));
                setAudioCodecs(Object.keys(FFMPEG_AVAILABLE.audio.codecs));
                setVideoCodecs(Object.keys(FFMPEG_AVAILABLE.video.codecs));
            })
            .then(() => {
                setLoad(false);
            })
    }
    const [load, setLoad] = useState(true);
    const [loadText, setLoadText] = useState("Loading Initial FFMPEG Data");

    const LoadingScreen = () => {
        if (load) {
            return (
                <div className="loading-wrapper">
                    <Loading />
                    <h4>{loadText}</h4>
                </div>)
        }
        else {
            return <></>;
        }
    }

    const [video, setVideo] = useState('')
    const [format, setFormat] = useState('');
    const [fps, setFps] = useState(0);
    const [vCodec, setVCodec] = useState('');
    const [aCodec, setACodec] = useState('');
    const [vBit, setVBit] = useState(0);
    const [aBit, setABit] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [outFormat, setOutFormat] = useState('webm');
    const [outFps, setOutFps] = useState(0);
    const [vOutCodec, setVOutCodec] = useState('libvpx-vp9');
    const [aOutCodec, setAOutCodec] = useState('libopus');
    const [vOutBit, setVOutBit] = useState(0);
    const [aOutBit, setAOutBit] = useState(0);
    const [outWidth, setOutWidth] = useState(0);
    const [outHeight, setOutHeight] = useState(0);
    const [totalFrames, setTotalFrames] = useState(0);
    /*
    console.log(outFormat);
    console.log(outFps);
    console.log(vOutCodec);
    console.log(aOutCodec);
    console.log(vOutBit);
    console.log(aOutBit);
    console.log(outWidth);
    console.log(outHeight);
    */
    const getOptions = (key_array) => {
        if (key_array === undefined)
            return [];
        var data = [];
        for (var key of key_array) {
            data.push({ value: key, label: key });
        }
        return data;
    }
    const [progress, setProgress] = useState(0)
    const saveProgress = (num)=>{
        setProgress(num)
        props.setProgressWindow(num)
        props.setProgressMessage("Processing frame number "+ num);
    }
    const onConvertClick = () =>{
        if(!isFileExists(video)){
            return;
        }
        const saveDir = getSaveDir();
        const sizeConst = width+'x'+height;
        const videoBitrate = Math.floor(vOutBit/1000)
        const audioBitrate = Math.floor(aOutBit/1000)
        console.log(sizeConst);
        props.setProgressCancel(true);
        props.setIsProgress(true);
        props.setProgressTotal(totalFrames);
        ffmpegProcess(video, saveDir,
            {format:outFormat, fps:outFps, videoCodec:vOutCodec, videoBitrate:videoBitrate, audioCodec:aOutCodec, audioBitrate:audioBitrate, size:sizeConst},
            {setProgress:setProgress, setProgressWindow:props.setProgressWindow, setProgressMessage:props.setProgressMessage}
        )
    }
    const fs = require('fs')
    const isFileExists = ()=>{
        try{
            if(fs.existsSync(video)){
                return true;
            }
        }catch(e) {
            return false
        }
        return false;
    }

    const getSaveDir = () =>{
        const use = video.split('.')
        use.pop();
        console.log(use);
        var text="";
        for(var usage of use){
            text = text+usage;
        }
        if(target==='Default'){
            return text+'__Converted_by_WebImage.'+outFormat;
        }
        else{
            return target+'\\'+use.join().split('\\')[use.join().split('\\').length-1]+'__Converted_by_WebImage.'+outFormat;
        }
    }

    const [drag, setDrag] = useState(false);

    useEffect(()=>{
       if(props.progressCancel===false && progress!==0)
            killProcess();
    }, )
    useEffect(() => {
        setFfmpegInfo();
    }, [FFMPEG_AVAILABLE])
    return (
        <>
            <div className="video-conv-wrapper">
                <div className="video-area">
                    <div className="video-container" >
                        <ReactPlayer controls={true} className='video-player' url={video}
                            height='85%' width='85%'
                        />
                    </div>
                    <div className='buttons-wrapper'>
                        <div className='buttons'>
                            <TooltipText style={{ marginRight: '10px' }} text={'Press right region to input video.'} />
                            <FileNameComp header={'Input File'} fileName={video} onClick={() => { getFile(); getVideoInfo(video) }} />
                        </div>
                        <div className='buttons'>
                            <TooltipText style={{ marginRight: '10px' }} text={'Press right region to select target directory. \n If target directory is on \"Default\", the program will automatically set directory into file\'s directory.'} />
                            <FileNameComp header={'Output Dir'} fileName={target} onClick={() => { getTargetDirectory() }} />
                        </div>
                    </div>
                    <div className='video-drag-setter'>
                        <DragGuide drag={drag}/>
                    </div>
                </div>
                <div className="video-info">
                    <div className="video-info-child">
                        <div className="infos">
                            <InfoChild title="Input Video"
                                helpText={"Information about input video."}
                                vFormatValue={format} vFormatIsDisabled={true}
                                vCodecValue={vCodec} vCodecIsDisabled={true} setVCodecValue={setVCodec}
                                vBitValue={vBit} vBitIsDisabled={true}
                                fpsValue={fps} fpsIsDisabled={true}
                                widthValue={width} widthIsDisabled={true}
                                heightValue={height} heightIsDisabled={true}
                                aCodecValue={aCodec} aCodecIsDisabled={true}
                                aBitValue={aBit} aBitIsDisabled={true}
                            />
                        </div>
                    </div>
                    <div className="video-info-child">
                        <div className="infos">
                            <InfoChild title="Output Video"
                                helpText={"Information about output video. \n If you want small-sized video, reduce bitrates. \n If you are not experted, don't change Format or Codecs."}
                                vFormatValue={outFormat} vFormatIsDisabled={false} vFormatOptions={getOptions(encodableFormats)} setVFormatValue={setOutFormat}
                                vCodecValue={vOutCodec} vCodecIsDisabled={false} setVCodecValue={setVOutCodec} vCodecOptions={getOptions(videoCodecs)}
                                vBitValue={vOutBit} vBitIsDisabled={false} setVBitValue={setVOutBit}
                                fpsValue={outFps} fpsIsDisabled={false} setFpsValue={setOutFps}
                                widthValue={outWidth} widthIsDisabled={false} setWidthValue={setOutWidth}
                                heightValue={outHeight} heightIsDisabled={false} setHeightValue={setOutHeight}
                                aCodecValue={aOutCodec} aCodecIsDisabled={false} setACodecValue={setAOutCodec} aCodecOptions={getOptions(audioCodecs)}
                                aBitValue={aOutBit} aBitIsDisabled={false} setABitValue={setAOutBit}
                            />
                        </div>
                    </div>
                </div>
                <div className="control-panel">
                    <div className="convert-button">
                        <ButtonComp text={"CONVERT"} handleClick={onConvertClick} textColor={'#fdf5e6'} backgroundColor={'#dc143c'}/>
                    </div>
                </div>
            </div>
            <LoadingScreen />
            <div className='drag-and-drop-area'
            onDrop={(e) => {
                dropEventListener(e, (p) => {
                    var extension = p.split('.')[p.split('.').length - 1];
                    if(isDirectory(p)){
                        props.setError(true);
                        props.setErrorText("Cannot directly instert directory")
                    }
                    else if (!availableFormat.includes(extension)) {
                        setDrag(false);
                        props.setError(true);
                        props.setErrorText("Video format not supported");
                        //initialize();
                        return;
                    }
                    setDrag(false);
                    setVideo(p);
                    getVideoInfo(p);
                    setFormat(p.split('.')[result.filePaths[0].split('.').length - 1]);
                })
            }}
            onDragOver={dragOverListener}
            onDragEnter={(e) => { dragEnterListener(e, () => { setDrag(true) }) }}
            onDragLeave={(e) => { dragLeaveListner(e, () => { setDrag(false) }) }}
            onClick={() => { setSizeSelectionClick(false) }}
        >
        </div>
        </>
    )
}

import Select from 'react-select';
import { traceProcessWarnings } from 'process';

function InfoChild(props) {

    return (
        <>
            <div className="info-child">
                <div className="info-child-title">
                    <h4>{props.title}</h4> 
                    <TooltipText style={{ marginLeft: '10px' }} text={props.helpText} />
                </div>
                <div className="info-child-container">
                    <Selection title={"Video Format"} value={props.vFormatValue} options={props.vFormatOptions} setValue={props.setVFormatValue} isDisabled={props.vFormatIsDisabled} />
                    <Input title={"FPS"} value={props.fpsValue} setValue={props.setFpsValue} isDisabled={props.fpsIsDisabled} />
                    <Input title={"Width"} value={props.widthValue} setValue={props.setWidthValue} isDisabled={props.widthIsDisabled} />
                    <Input title={"Height"} value={props.heightValue} setValue={props.setHeightValue} isDisabled={props.heightIsDisabled} />
                    <Selection title={"Video Codec"} value={props.vCodecValue} options={props.vCodecOptions} setValue={props.setVCodecValue} isDisabled={props.vCodecIsDisabled} />
                    <Input title={"Video Bitrate"} value={props.vBitValue} setValue={props.setVBitValue} isDisabled={props.vBitIsDisabled} />
                    <Selection title={"Audio Codec"} value={props.aCodecValue} options={props.aCodecOptions} setValue={props.setACodecValue} isDisabled={props.aCodecIsDisabled} />
                    <Input title={"Audio Bitrate"} value={props.aBitValue} setValue={props.setABitValue} isDisabled={props.aBitIsDisabled} />
                </div>
            </div>
        </>
    )
}

function Selection(props) {
    return (
        <>
            <div>
                <div className='selection-title'>
                    <span>{props.title}</span>
                    <div className='hr-container'><hr /></div>
                </div>
                <Select className='select' classNamePrefix='select' style={{ option: styles => ({ ...styles, color: '#000000', overflow: 'hidden' }) }} defaultValue={{ value: props.value, label: props.value }} value={{ value: props.value, label: props.value }} options={props.options === undefined ? [{ value: props.value, label: props.value }] : props.options} onChange={props.setValue === undefined ? () => { } : (data) => { props.setValue(data.value) }} isDisabled={props.isDisabled === undefined ? false : props.isDisabled}></Select>
            </div>
        </>
    )
}

function Input(props) {
    const setForm = () => {
        if (props.isDisabled === true) {
            return (
                <LooksLikeInput value={props.value} />
            )
        }
        else {
            return (
                <div className='delay-input-wrapper'>
                <DelayInput forceNotifyByEnter={true} style={{zIndex:30, height: "68%", width: "93%", borderRadius: "5px", fontSize: "1rem", paddingLeft: '0.5rem' }} delayTimeout={500} type="number" min={0} value={props.value} onChange={(e) => { if (props.setValue === undefined) { return }; props.setValue(e.target.value); }} disabled={props.isDisabled === undefined ? false : props.isDisabled} />
                </div>
            )
        }
    }

    return (
        <>
            <div>
                <div className='selection-title'>
                    <span>{props.title}</span>
                    <div className='hr-container'><hr /></div>
                </div>
                {setForm()}
            </div>
        </>
    )
}

function LooksLikeInput(props) {
    return (
        <div className='looks-like-input'>
            {props.value}
        </div>
    )
}

function isDirectory(f) {
    var fs = require('fs');
    return fs.statSync(f).isDirectory();
}