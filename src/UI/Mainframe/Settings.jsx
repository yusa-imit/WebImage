import React, { useEffect, useState } from 'react';
import './Settings.css';
import Switch from "react-switch";
import { getSync, setSync } from '../settings.js';
import DelayInput from 'react-delay-input';
import FileNameComp from './Component/FileNameComp.jsx';
import ButtonComp from './Component/ButtonComp.jsx';
import Scrollbars from 'react-custom-scrollbars'

/**
 * Class Setting
 * contains settings informations
 */
class Setting {
    constructor(key, title, type, text, etc = undefined, disableKey = undefined) {
        this.key = key;
        this.title = title;
        this.type = type;
        this.text = text;
        this.etc = etc;
        this.disableKey = disableKey;
    }
}


/**
 * 
 * @param {*} props none
 * @returns React Component
 */
export default function Settings(props) {
    // using state p for notifying setting updates
    const [p, setP] = useState(1);

    // settings state contains all settings informations in Object
    const [settings, setSettings] = useState({});

    // get video preset informations from json
    const presets = require('./encoding_preset.json');

    // settings component setter
    const list = [new Setting('backgroundAnimation', 'Background Animation', 'boolean', 'Turn on/off background bubble animation'),
    new Setting('postFix', 'File Name Postfix', 'text', 'Set output file\'s postfix variables'),
    new Setting('defaultStorage', 'Default Output Directory', 'selectBar', 'Set output file\'s dafault directory'),
    new Setting('usingVideoPreset', 'Using Video Preset', 'boolean', 'Turn on/off using video presets'),
    new Setting('videoPreset', 'Video Preset', 'buttonGroup', 'Set output video file in preset below', presets, 'usingVideoPreset')
    ]

    // notifying settings update
    const notifyUpdate = () => {
        setP(prev => prev + 1);
    }

    // mapping function
    const setList = () => {
        return list.map((value, index) => (<SettingsChild key={value.key} index={index} value={value} settings={settings} notifyUpdate={notifyUpdate} />))
    }

    // using useEffect to get setting update & re-render settings components
    useEffect(() => {
        setSettings(getSync())
    }, [p])
    return (<>
        <div className="settings-wrapper">
            <Scrollbars>
                <div className="settings-list">
                    {setList()}
                </div>
            </Scrollbars>
        </div>
    </>)
}

/**
 * 
 * @param {key, index, value, settings, notifyUpdate} props 
 * key : map function key value
 * value : contains settings class object
 * settings : contains settings state of mother component
 * notifyUpdate : function that notifies setting update
 * @returns React component
 */

const SettingsChild = (props) => {
    /**
     * Sets each component of children belongs to props.value.type
     * @returns React component
     */
    const setType = () => {
        switch (props.value.type) {
            case 'boolean':
                return <BooleanChild description={props.value.text} keyText={props.value.key} settings={props.settings} notifyUpdate={props.notifyUpdate} />
            case 'text':
                return <TextChild description={props.value.text} keyText={props.value.key} settings={props.settings} notifyUpdate={props.notifyUpdate} />
            case 'selectBar':
                return <SelectBarChild description={props.value.text} keyText={props.value.key} settings={props.settings} notifyUpdate={props.notifyUpdate} />
            case 'buttonGroup':
                return <ButtonGroupChild description={props.value.text} keyText={props.value.key} list={props.value.etc} disableKey={props.value.disableKey} settings={props.settings} notifyUpdate={props.notifyUpdate} />
            default:
                return (<></>);
        }
    }
    return (
        <div className="settings-child">
            <h5>{props.value.title}</h5>
            <hr />
            {setType()}
        </div>
    )
}

/**
 * 
 * @param {description, keyText, settings, notifyUpdate} props 
 * description : string : decription of the child
 * keyText : key of get or set settings
 * @returns React Component
 */
const BooleanChild = (props) => {
    const checked = props.settings[props.keyText] === undefined ? true : props.settings[props.keyText]
    const handleChange = (value, e) => {
        setSync(props.keyText, value);
        props.notifyUpdate();
    }
    return (
        <div className='boolean-child'>
            <h4>{props.description}</h4>
            <Switch className='boolean-switch' checked={checked} onChange={(value, e) => { handleChange(value, e) }} />
        </div>
    )
}

/**
 * 
 * @param {*} props 
 * same as above
 * @returns 
 */
const SelectBarChild = (props) => {
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
    return (
        <div className='selectbar-child'>
            <h4>{props.description}</h4>
            <FileNameComp className='selectbar-filename' header={''} disableHeader={true} fileName={props.settings[props.keyText]} onClick={getTargetDirectory} />
        </div>
    )
}

/**
 * 
 * @param {list, disableKey} props 
 * list : array : list of button group
 * disableKey : string : key of setting that disables button group
 * same as above
 * @returns React Component
 */
const TextChild = (props) => {
    const handleChange = (e) => {
        setSync(props.keyText, e.target.value);
        props.notifyUpdate()
    }
    return (
        <div className="text-child">
            <h4>{props.description}</h4>
            <DelayInput className="text-field" forceNotifyByEnter={true} delayTimeout={500} value={props.settings[props.keyText]} element='input' onChange={(e) => { handleChange(e) }} />
        </div>
    )
}

/**
 * 
 * @param {*} props 
 * same as above
 * @returns 
 */
const ButtonGroupChild = (props) => {
    const buttonList = Object.keys(props.list);
    const setButtons = () => {
        return buttonList.map((value, index) => (<ButtonComp key={index} disable={!props.settings[props.disableKey]}
            text={buttonList[index]} backgroundColor={props.settings[props.keyText] === buttonList[index] ? '#fff' : '#222'} textColor={props.settings[props.keyText] === buttonList[index] ? '#222' : '#fff'}
            handleClick={()=>{setSync(props.keyText, value); props.notifyUpdate()}}
            />))
    }
    return (
        <div className="buttongroup-child">
            <h4>{props.description}</h4>
            <div className="buttons-container">
                {setButtons()}
            </div>
        </div>
    )
}