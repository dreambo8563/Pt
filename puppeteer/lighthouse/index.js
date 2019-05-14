"use strict";
/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author ebidel@ (Eric Bidelman)
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom network throttling for Lighthouse Testing using Puppeteer.
 *
 * Chrome gets launched by Puppeteer (normally done by LH) and custom network
 * conditions are established through Puppeteer's APIs. Lighthouse then audits
 * the page with those settings.
 *
 * The flow is:
 * 1. Disable Lighthouse's default throttling settings.
 * 2. Launch Chrome using Puppeteer. Tell Lighthouse to reuse that chrome
 *    instance instead of launching it's own.
 * 3. Hand the url to Lighthouse for testing.
 * Puppeteer observes the page opening, then sets up emulation.
 */
var index_1 = require("../index");
var lighthouse = require('lighthouse');
// const ReportGenerator = require('lighthouse/lighthouse-core/report/v2/report-generator');
var fs = require("fs");
var url_1 = require("url");
function runLoghthouse(url) {
    return __awaiter(this, void 0, void 0, function () {
        var p, browser, remoteDebugPort, report;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new index_1.Puppeteer();
                    return [4 /*yield*/, p.init()];
                case 1:
                    browser = _a.sent();
                    remoteDebugPort = new url_1.URL(browser.wsEndpoint()).port;
                    // Watch for Lighthouse to open url, then customize network conditions.
                    // Note: re-establishes throttle settings every time LH reloads the page. Shooooould be ok :)
                    browser.on('targetchanged', function (target) { return __awaiter(_this, void 0, void 0, function () {
                        var page, client;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, target.page()];
                                case 1:
                                    page = _a.sent();
                                    if (!(page && page.url() === url)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, page.target().createCDPSession()];
                                case 2:
                                    client = _a.sent();
                                    // await client.send('Network.enable'); // Already enabled by pptr.
                                    return [4 /*yield*/, client.send('Network.emulateNetworkConditions', {
                                            offline: false,
                                            // values of 0 remove any active throttling. crbug.com/456324#c9
                                            latency: 800,
                                            downloadThroughput: Math.floor((1.6 * 1024 * 1024) / 8),
                                            uploadThroughput: Math.floor((750 * 1024) / 8) // 750Kbps
                                        })];
                                case 3:
                                    // await client.send('Network.enable'); // Already enabled by pptr.
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, lighthouse(url, {
                            port: remoteDebugPort,
                            output: 'html',
                            logLevel: 'info',
                            disableNetworkThrottling: true
                            //  disableCpuThrottling: true,
                            //  disableDeviceEmulation: true,
                        })];
                case 2:
                    report = (_a.sent()).report;
                    // Save html report.
                    fs.writeFileSync('results.html', report);
                    return [4 /*yield*/, browser.close()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.runLoghthouse = runLoghthouse;
//# sourceMappingURL=index.js.map