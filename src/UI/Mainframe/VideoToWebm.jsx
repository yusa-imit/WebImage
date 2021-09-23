import React, { useState, useEffect } from 'react'
import './VideoToWebm.css'
import { getMetaData, getFfmpegAvailables, ffmpegProcess } from '../lib/ffmpeg.js';
import Loading from './Component/Loading.jsx';
import ReactPlayer from 'react-player'
import FileNameComp from './Component/FileNameComp.jsx';
import TooltipText from './Component/TooltipText.jsx';

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
            console.log(data);
            setLoad(false);
        })
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
                            height='100%' width='fit-content'
                        />
                    </div>
                    <div className='buttons-wrapper'>
                        <div className='buttons'>
                            <TooltipText style={{ marginRight: '10px' }} text={'Press right region to input video.'} />
                            <FileNameComp header={'Input File'} fileName={video} onClick={() => { getFile() }} />
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