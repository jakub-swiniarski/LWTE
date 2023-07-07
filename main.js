const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { dialog } = require('electron');
const fs = require('fs');

//auto reload, use only for testing changes in files other than main.js
//require("electron-reload")(__dirname);
//if u need to use this, add this to package.json dependencies: "electron-reload": "^2.0.0-alpha.1"

let win;
let isFullscreen=false;

let themesPath = path.join(app.getPath('userData'),'themes.json');
let settingsPath = path.join(app.getPath('userData'),'settings.json');

let themes;
let settings;

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Open file",
        accelerator: "Ctrl+O",
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({properties: ["openFile"]});
          const file = filePaths[0];
          const contents = fs.readFileSync(file, "utf8");
          win.webContents.send("fileOpened",{contents,filePath:file});
        }
      },
      { type: 'separator' },
      {
        label: "Save",
        accelerator: "Ctrl+S",
        click: async () => {
          win.webContents.send("save");
        }
      },
      {
        label: "Save as",
        accelerator: "Ctrl+Shift+S",
        click: async () => {
          const filePaths = await dialog.showSaveDialog({});
          const file = filePaths.filePath;
          win.webContents.send("saveAs",file);
        }
      },
      { type: 'separator' },
      {
        label: "Exit",
        accelerator: "Ctrl+Q",
        click: async () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: "View",
    submenu: [
        {
          label: "Fullscreen",
          accelerator:  "F11",
          click: async () => {
            isFullscreen=!isFullscreen;
            win.setFullScreen(isFullscreen);
          }
        },
        { type: 'separator' },
        {
          label: "Zoom in",
          accelerator: "Ctrl+=",
          click: async () => {
            settings.fontSize+=4
            fs.writeFileSync(settingsPath, JSON.stringify(settings));
            win.webContents.send("changeFontSize", settings.fontSize);
          }
        },
        {
          label: "Zoom out",
          accelerator: "Ctrl+-",
          click: async () => {
            settings.fontSize-=4;
            fs.writeFileSync(settingsPath, JSON.stringify(settings));
            win.webContents.send("changeFontSize", settings.fontSize);
          }
        },
        { type: 'separator' },
        {
          label: "Themes",
          submenu: [
            {
              label: "Dark",
              click: async () => {
                win.webContents.send("changeTheme", 0, settingsPath, settings, themes);
              }
            },
            {
              label: "Light",
              click: async () => {
                win.webContents.send("changeTheme", 1, settingsPath, settings, themes);
              }
            },
            {
              label: "Hacker",
              click: async () => {
                win.webContents.send("changeTheme", 2, settingsPath, settings, themes);
              }
            }           
          ]
        },
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const createWindow = () => {
    win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: __dirname + '/icons/icon.png',
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        //preload: path.join(__dirname, 'preload.js')
      }
  })

  win.loadFile('index.html');
  win.webContents.on('did-finish-load', function() {
    if(!fs.existsSync(themesPath)){
      fs.writeFileSync(themesPath,JSON.stringify([
        {
            "fg": "rgb(255,255,255)",
            "bg": "rgb(39,39,39)"
        },
    
        {
            "fg": "rgb(0,0,0)",
            "bg": "rgb(255,255,255)"
        },
    
        {
            "fg": "rgb(0,255,0)",
            "bg": "rgb(0,0,0)"
        }
    ]));
    }
    themes = JSON.parse(fs.readFileSync(themesPath));
    
    if(!fs.existsSync(settingsPath)){
      fs.writeFileSync(settingsPath, JSON.stringify({"theme":0, "fontSize": 24}))
    }
    settings = JSON.parse(fs.readFileSync(settingsPath));

    win.webContents.send("loadSettings", settings, themes);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })

  //DEV TOOLS
  //win.webContents.openDevTools();
})

app.on('window-all-closed', () => {
    //uncomment before deploying for mac
    //if (process.platform !== 'darwin') {
      app.quit();
    //}
  })
