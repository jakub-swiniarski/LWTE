const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { dialog } = require('electron');
const fs = require('fs');

//auto reload, use only for testing changes in files other than main.js
//require("electron-reload")(__dirname);

let win;
let fontsize=24;
let isFullscreen=false;

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
            fontsize+=4;
            win.webContents.send("changeFontSize", fontsize);
          }
        },
        {
          label: "Zoom out",
          accelerator: "Ctrl+-",
          click: async () => {
            fontsize-=4;
            win.webContents.send("changeFontSize", fontsize);
          }
        },
        { type: 'separator' },
        {
          label: "Themes",
          submenu: [
            {
              label: "Dark",
              click: async () => {
                win.webContents.send("changeTheme", 0); //fg,bg
              }
            },
            {
              label: "Light",
              click: async () => {
                win.webContents.send("changeTheme", 1);
              }
            },
            {
              label: "Hacker",
              click: async () => {
                win.webContents.send("changeTheme", 2);
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
    win.webContents.send("loadSettings");
    //console.log(app.getPath('userData'));
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //send userdata path to renderer and then use it to write settings.json
    //and themes.json in that folder
    //users will be able to customize themes by editing the
    //themes.json file manually
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })