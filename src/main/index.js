import { app, BrowserWindow, net, Menu, session, ipcMain } from 'electron';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  (global).__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}


let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9090`
  : `file://${__dirname}/index.html`

// const template = [
//   {
//     label: 'Edit',
//     submenu: [
//       { role: 'undo' },
//       { role: 'redo' },
//       { type: 'separator' },
//       { role: 'cut' },
//       { role: 'copy' },
//       { role: 'paste' },
//       { role: 'pasteandmatchstyle' },
//       { role: 'delete' },
//       { role: 'selectall' }
//     ]
//   },
//   {
//     label: 'View',
//     submenu: [
//       { role: 'reload' },
//       { role: 'forcereload' },
//       { role: 'toggledevtools' },
//       { type: 'separator' },
//       { role: 'resetzoom' },
//       { role: 'zoomin' },
//       { role: 'zoomout' },
//       { type: 'separator' },
//       { role: 'togglefullscreen' }
//     ]
//   },
//   {
//     role: 'window',
//     submenu: [
//       { role: 'minimize' },
//       { role: 'close' }
//     ]
//   },
//   {
//     role: 'help',
//     submenu: [
//       {
//         label: 'Learn More',
//         click() { require('electron').shell.openExternal('https://electronjs.org') }
//       }
//     ]
//   }
// ]

// if (process.platform === 'darwin') {
//   template.unshift({
//     label: app.getName(),
//     submenu: [
//       { role: 'about' },
//       { type: 'separator' },
//       { role: 'services' },
//       { type: 'separator' },
//       { role: 'hide' },
//       { role: 'hideothers' },
//       { role: 'unhide' },
//       { type: 'separator' },
//       { role: 'quit' }
//     ]
//   })

//   // Edit menu
//   template[1].submenu.push(
//     { type: 'separator' },
//     {
//       label: 'Speech',
//       submenu: [
//         { role: 'startspeaking' },
//         { role: 'stopspeaking' }
//       ]
//     }
//   )

//   // Window menu
//   template[3].submenu = [
//     { role: 'close' },
//     { role: 'minimize' },
//     { role: 'zoom' },
//     { type: 'separator' },
//     { role: 'front' }
//   ]
// }

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)
function createWindow() {
  /**
   * Initial window options
   */
  session.defaultSession.webRequest.onBeforeRequest({}, function (details, callback) {
    var headers = details.requestHeaders;
    //这里我拿到需要的orderId去给render 然后调用支付接口
    if (details.url && details.url.indexOf("epay.163.com/cashier/m/standardCashier") > -1) {
      var orderIdstr = details.url.split("?")[1];
      var orderId = orderIdstr.split("=")[1];
      webC.send('asynchronous-reply', { orderId });
      console.log("onBeforeRequest ===> ", details.url)
    }
    callback(details)
  })


  session.defaultSession.webRequest.onBeforeSendHeaders({}, function (details, callback) {
    var headers = details.requestHeaders
    headers['User-Agent'] = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
    if (headers.hasOwnProperty("my_info")) {
      // 这边我会根据接口是否包含my_info来进行一次header信息的重组，相当于做了一次转发。
      var my_info = JSON.parse(headers['my_info']);
      for (var key in my_info) {
        headers[key] = my_info[key];
      }
      delete headers['my_info'];
    }
    callback({ cancel: false, requestHeaders: headers });
  });

  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 1000,
    webSecurity: false,
    webPreferences: { webSecurity: false },
  })

  mainWindow.loadURL(winURL);

  const webC = mainWindow.webContents.webContents;

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

