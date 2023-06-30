const fs = require("fs")
const { ipcRenderer } = require("electron")

let openedFilePath
const textElm=document.getElementById('text')
const currentTextValue = textElm.value

ipcRenderer.on('fileOpened', (event, {contents, filePath}) => {
    openedFilePath=filePath
    textElm.value=contents
    document.title=filePath
})

ipcRenderer.on("save", (event) => {
    fs.writeFileSync(openedFilePath, currentTextValue, "utf8")
})

ipcRenderer.on("saveAs", (event, filePath) => {
    //fs.writeFileSync(filePath, currentTextValue, "utf8")
})