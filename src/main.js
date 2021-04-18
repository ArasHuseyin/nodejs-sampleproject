//import { app, BrowserWindow, Menu } from 'electron';
//import { createRequire } from 'module';
//const require = createRequire(import.meta.url);
//const { app, BrowserWindow } = require('electron')
//import path from 'path';
//import electronHandlebars from 'electron-handlebars';
const { app, BrowserWindow } = require('electron');


//console.log(__dirname+'./templates/views/index.hbs');
//const viewsPath = path.join(__dirname, "templates/views");

/*
console.log(viewsPath);
require('electron-handlebars')({
  title: 'SaveChat',
  body: 'Test',
});
 
let mainWindow = null;
app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 700,
    height: 500,
  });
  mainWindow.loadURL(`file://${__dirname}/index.hbs`);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });
});
const { app, BrowserWindow } = require('electron')
*/
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})