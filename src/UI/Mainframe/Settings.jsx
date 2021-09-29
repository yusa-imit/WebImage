import React from 'react';
import './Settings.css';

class Setting{
    constructor(key,text){
        this.key=key;
        this.text = text;
    }
}

export default function Settings(props){
    const settings = [new Setting('postFix', ''),
    new Setting('backgroundAnimation', ''),
    new Setting('defaultStorage', '')
    ]
    const setList = () =>{
        return settings.map((value, index)=>(<SettingsChild key={value.key} index={index} text={value.text}/>))
    }
    const presets = require('./encoding_preset.json');
    console.log(presets)
    return(<>
    <div className="settings-wrapper">
        <div className="settings-list">
            {setList()}
        </div>
    </div>
    </>)
}


const SettingsChild = (props) =>{
    return(
        <div className="settings-child">
            
        </div>
    )
}