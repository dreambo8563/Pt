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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
/**
 * Shows how to use Puppeteer's code coverage API to measure CSS/JS coverage across
 * different points of time during loading. Great for determining if a lazy loading strategy
 * is paying off or working correctly.
 *
 * Install:
 *   npm i puppeteer chalk cli-table
 * Run:
 *   URL=https://example.com node code_coverage.js
 */
var index_1 = require("./index");
var chalk = require('chalk');
var Table = require('cli-table');
var URL = process.env.URL || 'https://www.baidu.com';
var EVENTS = [
    //   'domcontentloaded',
    //   'load',
    //   'networkidle2',
    'networkidle0'
];
function formatBytesToKB(bytes) {
    if (bytes > 1024) {
        var formattedNum = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 1
        }).format(bytes / 1024);
        return formattedNum + "KB";
    }
    return bytes + " bytes";
}
var UsageFormatter = /** @class */ (function () {
    function UsageFormatter(stat) {
        this.stats = stat;
    }
    UsageFormatter.eventLabel = function (event) {
        // const maxEventLabelLen = EVENTS.reduce((currMax, event) => Math.max(currMax, event.length), 0);
        // const eventLabel = event + ' '.repeat(maxEventLabelLen - event.length);
        return chalk.magenta(event);
    };
    UsageFormatter.prototype.summary = function (used, total) {
        if (used === void 0) { used = this.stats.usedBytes; }
        if (total === void 0) { total = this.stats.totalBytes; }
        var percent = Math.round((used / total) * 100);
        return formatBytesToKB(used) + "/" + formatBytesToKB(total) + " (" + percent + "%)";
    };
    UsageFormatter.prototype.shortSummary = function (used, total) {
        if (total === void 0) { total = this.stats.totalBytes; }
        var percent = Math.round((used / total) * 100);
        return used ? formatBytesToKB(used) + " (" + percent + "%)" : 0;
    };
    /**
     * Constructors a bar chart for the % usage of each value.
     * @param {!{jsUsed: number, cssUsed: number, totalBytes: number}=} stats Usage stats.
     * @return {string}
     */
    UsageFormatter.prototype.barGraph = function (stat) {
        if (stat === void 0) { stat = this.stats; }
        // const MAX_TERMINAL_CHARS = process.stdout.columns;
        var maxBarWidth = 30;
        var jsSegment = ' '.repeat((stat.jsUsed / stat.totalBytes) * maxBarWidth);
        var cssSegment = ' '.repeat((stat.cssUsed / stat.totalBytes) * maxBarWidth);
        var unusedSegment = ' '.repeat(maxBarWidth - jsSegment.length - cssSegment.length);
        return (chalk.bgRedBright(jsSegment) +
            chalk.bgBlueBright(cssSegment) +
            chalk.bgBlackBright(unusedSegment));
    };
    return UsageFormatter;
}());
var stats = new Map();
/**
 * @param {!Object} coverage
 * @param {string} type Either "css" or "js" to indicate which type of coverage.
 * @param {string} eventType The page event when the coverage was captured.
 */
function addUsage(coverage, type, eventType) {
    var e_1, _a, e_2, _b;
    try {
        for (var coverage_1 = __values(coverage), coverage_1_1 = coverage_1.next(); !coverage_1_1.done; coverage_1_1 = coverage_1.next()) {
            var entry = coverage_1_1.value;
            if (!stats.has(entry.url)) {
                stats.set(entry.url, []);
            }
            var urlStats = stats.get(entry.url);
            var eventStats = urlStats.find(function (item) { return item.eventType === eventType; });
            if (!eventStats) {
                eventStats = {
                    cssUsed: 0,
                    jsUsed: 0,
                    get usedBytes() {
                        return this.cssUsed + this.jsUsed;
                    },
                    totalBytes: 0,
                    get percentUsed() {
                        return this.totalBytes
                            ? Math.round((this.usedBytes / this.totalBytes) * 100)
                            : 0;
                    },
                    eventType: eventType,
                    url: entry.url
                };
                urlStats.push(eventStats);
            }
            eventStats.totalBytes += entry.text.length;
            try {
                for (var _c = __values(entry.ranges), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var range = _d.value;
                    eventStats[type + "Used"] += range.end - range.start - 1;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // console.log(eventStats, type, eventType);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (coverage_1_1 && !coverage_1_1.done && (_a = coverage_1.return)) _a.call(coverage_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function collectCoverage() {
    return __awaiter(this, void 0, void 0, function () {
        var p, browser, collectPromises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = new index_1.Puppeteer();
                    return [4 /*yield*/, p.init()];
                case 1:
                    browser = _a.sent();
                    collectPromises = EVENTS.map(function (event) { return __awaiter(_this, void 0, void 0, function () {
                        var page, _a, jsCoverage, cssCoverage;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log("Collecting coverage @ " + UsageFormatter.eventLabel(event) + "...");
                                    return [4 /*yield*/, browser.newPage()];
                                case 1:
                                    page = _b.sent();
                                    // page.on('response', async response => {
                                    //   console.log(response.request().url(), (await response.text()).length);
                                    // });
                                    return [4 /*yield*/, Promise.all([
                                            page.coverage.startJSCoverage(),
                                            page.coverage.startCSSCoverage()
                                        ])];
                                case 2:
                                    // page.on('response', async response => {
                                    //   console.log(response.request().url(), (await response.text()).length);
                                    // });
                                    _b.sent();
                                    return [4 /*yield*/, page.goto(URL, { waitUntil: event })];
                                case 3:
                                    _b.sent();
                                    return [4 /*yield*/, Promise.all([
                                            page.coverage.stopJSCoverage(),
                                            page.coverage.stopCSSCoverage()
                                        ])];
                                case 4:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), jsCoverage = _a[0], cssCoverage = _a[1];
                                    addUsage(cssCoverage, 'css', event);
                                    addUsage(jsCoverage, 'js', event);
                                    return [4 /*yield*/, page.close()];
                                case 5:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(collectPromises)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, browser.close()];
            }
        });
    });
}
function runCodeCoverage() {
    return __awaiter(this, void 0, void 0, function () {
        var e_3, _a, _loop_1, stats_1, stats_1_1, _b, url, vals;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, collectCoverage()];
                case 1:
                    _c.sent();
                    _loop_1 = function (url, vals) {
                        console.log('yyyyy', url);
                        console.log('\n' + chalk.cyan(url));
                        var table = new Table({
                            // chars: {mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
                            head: [
                                'Event',
                                chalk.bgRedBright(' JS ') + " " + chalk.bgBlueBright(' CSS ') + " % used",
                                'JS used',
                                'CSS used',
                                'Total bytes used'
                            ],
                            // style : {compact : true, 'padding-left' : 0}
                            style: { head: ['white'], border: ['grey'] }
                            // colWidths: [20, 20]
                        });
                        EVENTS.forEach(function (event) {
                            var e_4, _a;
                            var usageForEvent = vals.filter(function (val) { return val.eventType === event; });
                            if (usageForEvent.length) {
                                try {
                                    for (var usageForEvent_1 = __values(usageForEvent), usageForEvent_1_1 = usageForEvent_1.next(); !usageForEvent_1_1.done; usageForEvent_1_1 = usageForEvent_1.next()) {
                                        var s = usageForEvent_1_1.value;
                                        // totalBytes += stats.totalBytes;
                                        // totalUsedBytes += stats.usedBytes;
                                        console.log(s, s.percentUsed, s.usedBytes);
                                        var formatter = new UsageFormatter(s);
                                        //   console.log(
                                        //     'xxxx',
                                        //     UsageFormatter.eventLabel(s.eventType),
                                        //     // formatter.barGraph(),
                                        //     formatter.shortSummary(s.jsUsed), // !== 0 ? `${formatBytesToKB(stats.jsUsed)}KB` : 0,
                                        //     formatter.shortSummary(s.cssUsed),
                                        //     formatter.summary()
                                        //   );
                                        table.push([
                                            UsageFormatter.eventLabel(s.eventType),
                                            formatter.barGraph(),
                                            formatter.shortSummary(s.jsUsed),
                                            formatter.shortSummary(s.cssUsed),
                                            formatter.summary()
                                        ]);
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (usageForEvent_1_1 && !usageForEvent_1_1.done && (_a = usageForEvent_1.return)) _a.call(usageForEvent_1);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                            }
                            else {
                                table.push([
                                    UsageFormatter.eventLabel(event),
                                    'no usage found',
                                    '-',
                                    '-',
                                    '-'
                                ]);
                            }
                        });
                        console.log(table.toString());
                    };
                    try {
                        for (stats_1 = __values(stats), stats_1_1 = stats_1.next(); !stats_1_1.done; stats_1_1 = stats_1.next()) {
                            _b = __read(stats_1_1.value, 2), url = _b[0], vals = _b[1];
                            _loop_1(url, vals);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (stats_1_1 && !stats_1_1.done && (_a = stats_1.return)) _a.call(stats_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    // Print total usage for each event.
                    // console.log('\n');
                    EVENTS.forEach(function (event) {
                        var totalBytes = 0;
                        var totalUsedBytes = 0;
                        var metrics = Array.from(stats.values());
                        var statsForEvent = metrics.map(function (eventStatsForUrl) {
                            var statsEvent = eventStatsForUrl.filter(function (stat) { return stat.eventType === event; })[0];
                            // TODO: need to sum max totalBytes. Currently ignores stats if event didn't
                            // have an entry. IOW, all total numerators should be max totalBytes seen for that event.
                            if (statsEvent) {
                                totalBytes += statsEvent.totalBytes;
                                totalUsedBytes += statsEvent.usedBytes;
                            }
                        });
                        var percentUsed = Math.round((totalUsedBytes / totalBytes) * 100);
                        console.log("Total used @ " + chalk.magenta(event) + ": " + formatBytesToKB(totalUsedBytes) + "/" + formatBytesToKB(totalBytes) + " (" + percentUsed + "%)");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.runCodeCoverage = runCodeCoverage;
//# sourceMappingURL=codeCoverage.js.map