import React, {useEffect, useState} from 'react';
import './Settings.css';
import Switch from "react-switch";
import {getSync, setSync} from '../settings.js';

class Setting{
    constructor(key,title,type,text, etc=undefined, disableKey=undefined){
        this.key=key;
        this.title = title;
        this.type = type;
        this.text = text;
        this.etc = etc;
        this.disableKey = disableKey;
    }
}

export default function Settings(props){
    const [p, setP] = useState(1);
    const [settings, setSettings] = useState({});
    const presets = require('./encoding_preset.json');
    const list = [new Setting('backgroundAnimation', 'Background Animation','boolean',''),
    new Setting('postFix', 'File Name Postfix', 'text',''),
    new Setting('defaultStorage', 'Default Output Directory', 'selectBar',''),
    new Setting('usingVideoPreset','Using Video Preset', 'boolean',''),
    new Setting('videoPreset', 'Video Preset', 'buttonGroup','', presets, 'usingVideoPreset')
    ]
    const notifyUpdate = () =>{
        setP(prev=>prev+1);
    }
    const setList = () =>{
        return list.map((value, index)=>(<SettingsChild key={value.key} index={index} value={value} settings={settings} notifyUpdate={notifyUpdate}/>))
    }
    useEffect(()=>{
        setSettings(getSync())
    }, [p])
    return(<>
    <div className="settings-wrapper">
        <div className="settings-list">
            {setList()}
        </div>
    </div>
    </>)
}


const SettingsChild = (props) =>{
    const setType = () =>{
        switch(props.type){
            case 'boolean':
                return <BooleanChild description={props.value.text} keyText={props.value.key} settings={props.settings} notifyUpdate={props.notifyUpdate}/>
            case 'text':
                return <TextChild description={props.value.text} keyText={props.value.key} settings={props.settings} notifyUpdate={props.notifyUpdate}/>
            case 'selectBar':
                return <SelectBarChild description={props.value.text} keyText={props.value.key} settings={props.settings} notifyUpdate={props.notifyUpdate}/>
            case 'buttonGroup':
                return <ButtonGroupChild description={props.value.text} keyText={props.value.key} list={props.value.etc} disableKey={props.value.disableKey} settings={props.settings} notifyUpdate={props.notifyUpdate}/>
            default:
                return (<></>);
        }
    }
    return(
        <div className="settings-child">
            <h6>{props.title}</h6>
            <hr/>
            {setType()}
        </div>
    )
}

const BooleanChild = (props)=>{
    const handleChange=(value,e)=>{
        setSync(props.keyText, value);
        props.notifyUpdate();
    }
    return(
        <div>
            <h4>{props.description}</h4>
            <Switch checked={props.settings[props.keyText]} onChange={(value, e)=>{handleChange(value, e)}}/>
        </div>
    )
}

const SelectBarChild = (props) =>{
    const dialog = require('electron').remote.dialog;
    const getTargetDirectory = () => {
        const dir = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        })
        if (dir === undefined) {
            setSync(props.keyText, 'default')
        }
        else {
            setSync(props.keyText, dir);
        }
        props.notifyUpdate()
    }
    return(
        <div>
            <h4>{props.description}</h4>
            <FileNameComp header={'Directory'} fileName={props.settings[props.keyText]} onClick={getTargetDirectory}/>
        </div>
    )
}
const TextChild = (props)=>{
    const handleChange = (e) =>{
        setSync(props.keyText, e.target.value);
        props.notifyUpdate()
    }
    return(
        <div>
            <h4>{props.description}</h4>
            <DelayInput forceNotifyByEnter={true} delayTimeout={500} value={props.settings[props.keyText]} element='textarea' onChange={(e)=>{handleChange(e)}}/>
        </div>
    )
}

const ButtonGroupChild = (props) =>{
    const buttonList = Object.keys(props.list);
    const setButtons = () =>{
        return buttonList.map((value, index)=>(<ButtonComp key={index} disable={props.settings[props.disableKey]}
            text={buttonList[index]} backgroundColor={props.settings[props.keyText]===buttonList[index]?'#fff':'#222'} textColor={props.settings[props.keyText]===buttonList[index]?'#222':'#fff'}/>))
    }
    return(
        <div>
            <h4>{props.description}</h4>
            <div>
                {setButtons()}
            </div>
        </div>
    )
}