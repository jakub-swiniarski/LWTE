const fs = require("fs")
const { ipcRenderer } = require("electron")

ipcRenderer.on('file', (event, content) => {
    document.getElementById('text').value=content
})