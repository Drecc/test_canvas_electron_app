
const {app, BrowserWindow, BrowserView, ipcMain, contentTracing} = require('electron')
const path = require('path')

var mainWindow = null;

// app.disableHardwareAcceleration()

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  let enableDrawWidget = true;
  mainWindow = new BrowserWindow({width: 800, height: 600, enableDrawWidget: enableDrawWidget,   
                                webPreferences:{
                                nodeIntegration: true,
                                webSecurity:false,
                              }});
  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL(path.join('file://', __dirname, '/dist/index.html'));

  mainWindow.on("on-draw-path-event", function(event, x){
    mainWindow.webContents.send("my_point_move", x);
  });

  mainWindow.webContents.on("did-finish-load", function(event){
    mainWindow.webContents.send("stop_canvas_draw", enableDrawWidget);

  });

  ipcMain.on("switch-draw-widget", function(event, is_open){
    if(is_open) {
      mainWindow.openDrawWidget();
      mainWindow.webContents.send("stop_canvas_draw", true);
    }
    else {
      mainWindow.closeDrawWidget();
      mainWindow.webContents.send("stop_canvas_draw", false);
    }
  })

  // mainWindow.setFullScreen(true);

  // mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  // (async () => {
  //   await contentTracing.startRecording({
  //     include_categories: ['*']
  //   })
  //   console.log('Tracing started')
  //   await new Promise(resolve => setTimeout(resolve, 15000))
  //   const path = await contentTracing.stopRecording()
  //   console.log('Tracing data recorded to ' + path)
  // })()

});