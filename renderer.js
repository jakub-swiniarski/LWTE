const fs = require("fs");
const { ipcRenderer } = require("electron");

import themes from './themes.json' assert {type: 'json'};

let openedFilePath;
const textElm=document.getElementById('text');
//const currentTextValue = textElm.value;

ipcRenderer.on('fileOpened', (event, {contents, filePath}) => {
    openedFilePath=filePath;
    textElm.value=contents;
    document.title=filePath;
});

ipcRenderer.on("save", (event) => {
    fs.writeFileSync(openedFilePath, textElm.value, "utf8");
});

ipcRenderer.on("saveAs", (event, file) => {
    fs.writeFileSync(file, textElm.value, "utf8");
    openedFilePath = file;
    textElm.value = fs.readFileSync(openedFilePath, "utf8");
    document.title=file;
});

ipcRenderer.on("changeFontSize", (event, fontsize) => {
    textElm.style.fontSize=fontsize+"px";
});

ipcRenderer.on("changeTheme", (event, x) => {
    textElm.style.backgroundColor=themes[x].bg;
    textElm.style.color=themes[x].fg;
    document.body.style.backgroundColor=themes[x].bg;
})