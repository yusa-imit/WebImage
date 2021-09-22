import * as React from 'react';
import * as ReactDOM from 'react-dom';
import UI from './UI/UI.jsx';
import './app.css'

//
// app.jsx
//
// Main Entry point of renderer process
//
function render() {
  ReactDOM.render(
    <>
        <UI/>
    </>
  , document.body);
}

render();