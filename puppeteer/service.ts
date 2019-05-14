import { runCodeCoverage } from './codeCoverage';
import { runLoghthouse } from './lighthouse';
import { ipcMain, BrowserWindow, screen } from 'electron';
import * as url from 'url';
import * as path from 'path';

export function registerMainChannels(win) {
  // regerister channel
  ipcMain.on('codeCoverage', async (event, u: string) => {
    try {
      const [res, _] = await Promise.all([
        runCodeCoverage(u),
        runLoghthouse(u)
      ]);

      event.sender.send('report', {
        coverage: res
      });
    } catch (error) {
      event.sender.send('report.error', error.message);
    }
  });

  // regerister channel
  ipcMain.on('lighthouse.report', event => {
    const { width, height } = screen.getPrimaryDisplay().size;
    const child = new BrowserWindow({
      parent: win,
      x: 0,
      y: 0,
      width: width / 2,
      height: height / 2,
      fullscreen: false,
      fullscreenable: false,
      darkTheme: true
      //   minWidth: 700
    });
    child.loadURL(
      url.format({
        pathname: path.join(__dirname, '..', 'results.html'),
        protocol: 'file:',
        slashes: true
      })
    );
    child.webContents.on('did-finish-load', () => {
      // modify to dark mode
      const code = `document.body.className = document.body.className + ' dark'`;
      child.webContents.executeJavaScript(code);
    });
    child.show();
  });
}
