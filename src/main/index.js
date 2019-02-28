import { app, BrowserWindow, net } from 'electron';



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


function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 1000,
    webSecurity: false,
    webPreferences: { webSecurity: false },
  })

  mainWindow.loadURL(winURL);

  const ses = mainWindow.webContents.session
  const config = {
    proxyRules: "http://localhost:9090/;https://my.cbg.163.com/"
  }
  // ses.setProxy(config, (e) => { });
  // const { net } = require("electron");
  // let request = net.request("http://localhost:9090");
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
