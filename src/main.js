const { app, screen, remote} = require('electron');
const path = require('path');

// Library 'sharp' need to included when main process started
// It's component stacked in memory and become ready-to-use
//const sharp = require('sharp');

//global.ffmpegpath = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked')

// [Deprecated]
const {setVibrancy, BrowserWindow } = require('electron-acrylic-window')
//const {BrowserWindow} = require('electron')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 640,
    minHeight: 560,
    width: screen.getPrimaryDisplay().workAreaSize.width/2,
    height: screen.getPrimaryDisplay().workAreaSize.height/3,
    frame:false,
    transparent:true,
    resizable:true,
    icon:path.join(__dirname, 'assets/png/icon.png'),
    vibrancy:{theme:'#FFFFFF00', effect:'blur', useCustomWindowRefreshMethod:true, maximumRefreshRate:60, disableOnBlur:false},
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity:false,
    }
  });
  mainWindow.setVibrancy({theme:'#FFFFFF00', effect:'blur', useCustomWindowRefreshMethod:true, maximumRefreshRate:60, disableOnBlur:false})
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.