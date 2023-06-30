const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { dialog } = require('electron')
const fs = require('fs')

//auto reload
require("electron-reload")(__dirname)

let win

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Open file",
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({properties: ["openFile"]})
          const file = filePaths[0]
          const contents = fs.readFileSync(file, "utf8")
          win.webContents.send('file', contents)
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const createWindow = () => {
    win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        //preload: path.join(__dirname, 'preload.js')
      }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  //DEV TOOLS
  //win.webContents.openDevTools()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })