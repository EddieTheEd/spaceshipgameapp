const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store');

const store = new Store();

// Make the store instance accessible in global scope
global.store = store;

// Listen for the save request from the renderer process
ipcMain.on('save-data', (event, key, value) => {
  if (store.get(key) === undefined) {
  store.set(key, value);
  event.reply('data-saved');
  }
  else {
    console.log("duplicate")
  }
});

// Listen for the retrieve request from the renderer process
ipcMain.on('retrieve-data', (event, key) => {
  const value = store.get(key);
  event.reply('data-retrieved', value);
});

ipcMain.handle('retrieve-all-data', () => {
  const allData = store.store;
  const allEntries = Object.entries(allData);
  const allValues = allEntries.map(([key, value]) => ({ key, value }));
  return allValues;
});

ipcMain.handle('clear-all-data', () => {
  store.clear();
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.hide()
  win.maximize()
  win.show()
  win.loadFile('main.html') // no clue why experimental.html does not work.
}
app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()
})