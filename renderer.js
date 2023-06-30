const fs = require("fs")
const { ipcRenderer } = require("electron")

let openedFilePath
const textElm=document.getElementById('text')

ipcRenderer.on('fileOpened', (event, {contents, filePath}) => {
    openedFilePath=filePath
    textElm.value=contents
    document.title=filePath
})

ipcRenderer.on("save", (event) => {
    const currentTextValue = textElm.value
    fs.writeFileSync(openedFilePath, currentTextValue, "utf8")
})

ipcRenderer.on("saveAs", (event) => {
    console.log("SAVE AS")
})