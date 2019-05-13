import * as fs from 'fs';
import * as puppeteer from 'puppeteer-core';

export class Puppeteer {
  chromePath: string;
  constructor() {}
  async init() {
    this.chromePath = this._getDefaultOsPath();
    if (fs.existsSync(this.chromePath)) {
      return puppeteer.launch({
        headless: true,
        executablePath: this.chromePath
      });
    }
  }
  _getDefaultOsPath() {
    if (process.platform === 'win32') {
      return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
    } else {
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
  }
}
