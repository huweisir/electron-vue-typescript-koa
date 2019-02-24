import { app, BrowserWindow } from 'electron';
import httpProxy from 'http-proxy';
var http = require('http');


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
    webSecurity: false
  })

  mainWindow.loadURL(winURL);
  // var proxy = httpProxy.createProxyServer({});
  // var server = http.createServer(function (req, res) {
  //   console.log("=====>serve")
  //   delete req.headers.host;//一定要把host删除，不然会出现404，我在这里踩了好久的坑！
  //   proxy.web(req, res, { target: 'http://www.baidu.com' });
  //   proxy.on("proxyRes", () => {
  //     reqNum--;
  //     console.log("完成一个请求,当前的剩余的请求数量是 " + reqNum);
  //   });
  //   proxy.on("proxyReq", () => {
  //     reqNum++;
  //     console.log("接收到一个请求,当前的请求数量是 " + reqNum);
  //   });
  // });
  const ses = mainWindow.webContents.session
  const config = {
    proxyRules: "http://localhost:9090/;https://my.cbg.163.com/"
  }
  // ses.setProxy(config, (e) => { });

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
