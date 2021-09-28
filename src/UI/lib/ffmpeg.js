/**
 * FFMPEG Library
 * Export : getMetaData(@promise), getFfmpegAvailables(@promise), ffmpegProcess
 * runs ffmpeg functions in javascript.
 * converts input viedo into output video
 */

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

/**
 * FFMPEG Path setting
 * For default, fluent-ffmpeg needs ffmpeg library's path information as PATH os env virables
 * These lines set FFMPEG path into project-shared library
 * refers https://alexandercleasby.dev/blog/use-ffmpeg-electron
 */
//const ffmpeg_path = path.join(__dirname,'/ffmpeg4.4/bin/ffmpeg.exe');
//const ffprobe_path = path.join(__dirname,'/ffmpeg4.4/bin/ffprobe.exe');
const ffmpeg_path = require('ffmpeg-static-electron').path;
//const ffmpeg_path = require('electron').remote.getGlobal('ffmpegpath');
console.log(ffmpeg_path);

const ffprobe_path = require('ffprobe-static').path
console.log(ffprobe_path)

ffmpeg.setFfmpegPath(ffmpeg_path);
ffmpeg.setFfprobePath(ffprobe_path);

/**
 * Main Processing Function
 * @param {input file directory : String} fileDir 
 * @param {output file directory : String} saveDir 
 * @param {metadata : Object} metadata 
 * @param {called when process started : function} onStart 
 * @param {called when process got error when processing video : function} onError 
 * @param {called when process ended : function} onEnd 
 * @param {called when process got progress : function} functions 
 * @param {called when process got error of standard i/o : function} onStderr 
 * 
 */
const command = new ffmpeg();
function ffmpegProcess (fileDir, saveDir, metadata, functions={}){
    command
    .input(fileDir)
    .format(metadata.format)
    .fps(metadata.fps)
    .videoCodec(metadata.videoCodec)
    .videoBitrate(metadata.videoBitrate, true)
    .audioCodec(metadata.audioCodec)
    .audioBitrate(metadata.audioBitrate)
    .size("1280x720")
    .autoPad()
    .on('start', (data)=>{
        console.log(data);
    })
    .on('error', (err)=>{
        console.log(err.message)
        functions.setProgressMessage("Process Cancelled");
    })
    .on('end', ()=>{
        functions.setProgressMessage("DONE!");
        console.log('FINISHED')
    })
    .on('stderr', (err)=>{
        functions.setProgressMessage(err);
    })
    .on('progress', (progress)=>{
        console.log(progress)
        functions.setProgress(progress.percent);
        functions.setProgressWindow(progress.frames);
        functions.setProgressMessage("Processing frame number "+ progress.frames);
    })
    .save(saveDir);
}
function killProcess(){
    command.kill();
}


/**
 * Get video's metadata informations
 * @param {viedo directory : string} dir 
 * @returns ::Promise::video metadata : Object
 */
async function getMetaData (dir){
    let meta = await getMeta(dir);
    console.log(meta)
    return meta;
}

function getMeta (dir){
    return new Promise((resolve, reject)=>{
        ffmpeg.ffprobe(dir, (err, metadata)=>{
            resolve(metadata)
        })
    })
}

/**
 * Get FFMPEG's Library informations
 * @returns ::Promise:: ffmpeg's available asset informations:Object
 */
async function getFfmpegAvailables (){
    const formats = await getFormatAvailable()
    const codecs = await getCodecAvailable()
    const encoders = await getEncoderAvailable()
    const filters = await getFilterAvailable()
    return {'formats':formats, 'codecs':codecs, 'encoders':encoders, 'filters':filters}
}


function getFormatAvailable (){
    return new Promise((resolve, reject)=>{
        ffmpeg.getAvailableFormats((err, formats)=>{
            resolve(formats);
        })
    })
}

function getCodecAvailable (){
    return new Promise((resolve, reject)=>{
        ffmpeg.getAvailableCodecs((err, codecs)=>{
            resolve(codecs);
        })
    })
}

function getEncoderAvailable (){
    return new Promise((resolve, reject)=>{
        ffmpeg.getAvailableEncoders((err, encoders)=>{
            resolve(encoders);
        })
    })
}

function getFilterAvailable (){
    return new Promise((resolve, reject)=>{
        ffmpeg.getAvailableFilters((err, filters)=>{
            resolve(filters);
        })
    })
}


export {killProcess, getMetaData, getFfmpegAvailables, ffmpegProcess}