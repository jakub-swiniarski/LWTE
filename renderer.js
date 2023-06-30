const fs = require("fs")
const { ipcRenderer } = require("electron")

ipcRenderer.on('fileOpened', (event, {contents, filePath}) => {
    document.getElementById('text').value=contents
    document.title=filePath
})