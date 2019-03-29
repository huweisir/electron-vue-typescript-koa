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
  // session.defaultSession.webRequest.onHeadersReceived({}, function (detail, callback) {
  //   if (detail.responseHeaders.hasOwnProperty("location")) {
  //     console.log('====>onHeadersReceived    location', detail.responseHeaders.location)
  //   }
  //   console.log('====>onHeadersReceived    location', detail.responseHeaders)

  //   callback(detail)
  // })

  session.defaultSession.webRequest.onBeforeRequest({}, function (details, callback) {
    var headers = details.requestHeaders;
    // console.log("onBeforeRequest===>", details)
    if (details.url && details.url.indexOf("epay.163.com/cashier/m/standardCashier") > -1) {
      console.log("onBeforeRequest===>", details.url)
      var orderIdstr = details.url.split("?")[1];
      var orderId = orderIdstr.split("=")[1];
      webC.send('asynchronous-reply', orderId)
      // https://epay.163.com/cashier/m/standardCashier?orderId=2019032910JY23345734
    }
    callback(details)
  })


  session.defaultSession.webRequest.onBeforeSendHeaders({}, function (details, callback) {
    var headers = details.requestHeaders
    headers['User-Agent'] = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
    if (headers.hasOwnProperty("my_info")) {
      var my_info = JSON.parse(headers['my_info']);
      for (var key in my_info) {
        headers[key] = my_info[key];
      }
      delete headers['my_info'];
    }
    if (headers.hasOwnProperty("upgrade-insecure-requests")) {
      console.log("onBeforeSendHeaders===>  upgrade-insecure-requests", headers);
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

  // mainWindow.webContents.debugger.on('message', (event, method, params) => {
  //   console.log('message==============>', event, params)
  // });

  const ses = mainWindow.webContents.session;
  const webC = mainWindow.webContents.webContents;


  let request = net.request(
    {
      method: 'GET',
      protocol: 'https:',
      hostname: 'my.cbg.163.com/cgi',
      port: 9090,
      path: '/'
    });

  request.on("response", response => {
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

    response.on("data", chunk => {
      console.log(`BODY: ${chunk}`);
    });

    response.on("end", () => {
      console.log("没有更多数据！");
    });
  });

  exports.request1 = request;
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
    //   //
    //   // Create your server that makes an operation that waits a while
    //   // and then proxies the request
    //   //
    //   http.createServer(function (req, res) {
    //     // This simulates an operation that takes 500ms to execute
    //     setTimeout(function () {
    //       proxy.web(req, res, {
    //         target: 'http://localhost:9008'
    //       }, (e) => {
    //         console.log("proxy error call back ");
    //         console.log(e);
    //       });
    //     }, 10);

    //   }).listen(8008);

  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
