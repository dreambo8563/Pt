"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var codeCoverage_1 = require("./codeCoverage");
var lighthouse_1 = require("./lighthouse");
var electron_1 = require("electron");
var url = require("url");
var path = require("path");
function registerMainChannels(win) {
    var _this = this;
    // regerister channel
    electron_1.ipcMain.on('codeCoverage', function (event, u) { return __awaiter(_this, void 0, void 0, function () {
        var _a, res, _, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all([
                            codeCoverage_1.runCodeCoverage(u),
                            lighthouse_1.runLighthouse(u)
                        ])];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), res = _a[0], _ = _a[1];
                    event.sender.send('report', {
                        coverage: res
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    event.sender.send('report.error', error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // regerister channel
    electron_1.ipcMain.on('lighthouse.report', function (event) {
        var userDataPath = (electron_1.app || electron_1.remote.app).getPath('userData');
        var p = path.join(userDataPath, 'results.html');
        // Save html report.
        var _a = electron_1.screen.getPrimaryDisplay().size, width = _a.width, height = _a.height;
        var child = new electron_1.BrowserWindow({
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
        child.loadURL(url.format({
            pathname: p,
            protocol: 'file:',
            slashes: true
        }));
        child.webContents.on('did-finish-load', function () {
            // modify to dark mode
            var code = "document.body.className = document.body.className + ' dark'";
            child.webContents.executeJavaScript(code);
        });
        child.show();
    });
}
exports.registerMainChannels = registerMainChannels;
//# sourceMappingURL=service.js.map