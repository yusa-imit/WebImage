import React, { useState, useEffect } from 'react'
import './VideoToWebm.css'
import { getMetaData, getFfmpegAvailables, ffmpegProcess } from '../lib/ffmpeg.js';
import Loading from './Component/Loading.jsx';
import ReactPlayer from 'react-player'
import FileNameComp from './Component/FileNameComp.jsx';
import TooltipText from './Component/TooltipText.jsx';
import { DelayInput } from 'react-delay-input';
import VideoPlayer from 'react-video-js-player';

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
                        setFormat(result.filePaths[0].split('.')[result.filePaths[0].split('.').length-1]);
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
    }
    const setAudioInfo = (data) => {
        setACodec(data.codec_name);
        setABit(data.bit_rate);
    }

    const setFfmpegInfo = () => {
        getFfmpegAvailables().then(data => {
            FFMPEG_AVAILABLE = dataPreprocessing(data);
            setAvailableFormat(Object.keys(FFMPEG_AVAILABLE.decodableFormats));
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
                            <FileNameComp header={'Output Directory'} fileName={target} onClick={() => { getTargetDirectory() }} />
                        </div>
                    </div>
                </div>
                <div className="video-info">
                    <div className="video-info-child">
                        <div className="infos">
                            <InfoChild title="Input Video"
                                vFormatValue={format} vFormatIsDisabled={true}
                                vCodecValue={vCodec} vCodecIsDisabled={true} setVCodecValue={setVCodec}
                                vBitValue={vBit} vBitIsDisabled={true}
                            />
                        </div>
                    </div>
                    <div className="video-info-child">

                    </div>
                </div>
                <div className="control-panel">
                    <div className="progress-bar">

                    </div>
                    <div className="convert-button">

                    </div>
                </div>
            </div>
            <LoadingScreen />
        </>
    )
}

import Select from 'react-select';

function InfoChild(props) {

    return (
        <>
            <div className="info-child">
                <h4>{props.title}</h4>
                <Selection title={"Video Format"} value={props.vFormatValue} options={props.vFormatOptions} setValue={props.setVFormatValue} isDisabled={props.vFormatIsDisabled} />
                <Selection title={"Video Codec"} value={props.vCodecValue} options={props.vCodecOptions} setValue={props.setVCodecValue} isDisabled={props.vCodecIsDisabled} />
                <Input title={"Video Bitrate"} value={props.vBitValue} setValue={props.setBitValue} isDisabled={props.vBitIsDisabled}/>
            </div>
        </>
    )
}

function Selection(props) {
    console.log(props)
    return (
        <>
            <div className='selection-title'>
                <span>{props.title}</span>
                <div className='hr-container'><hr /></div>
            </div>
            <Select defaultValue={{value:props.value, label:props.value}} value={{value:props.value, label:props.value}} options={props.options===undefined?[{value:props.value, label:props.value}]:props.options} onChange={props.setValue === undefined ? () => { } : props.setValue} isDisabled={props.isDisabled === undefined ? false : props.isDisabled}></Select>
        </>
    )
}

function Input(props) {
    const setForm = ()=>{
        if(props.isDisabled===true){
            return(
                <LooksLikeInput value={props.value}/>
            )
        }
        else{
            return(
                <DelayInput delayTimeout={500} type="number" min={1} value={props.value} onChange={(e) => {if(props.setValue===undefined){return}; props.setValue(e.target.value);}} disabled={props.isDisabled===undefined ? false : props.isDisabled}/>
            )
        }
    }
    
    return(
        <>
            <div className='selection-title'>
                <span>{props.title}</span>
                <div className='hr-container'><hr /></div>
            </div>
            {setForm()}
        </>
    )
}

function LooksLikeInput(props){
    return(
        <div className='looks-like-input'>
            {props.value}
        </div>
    )
}