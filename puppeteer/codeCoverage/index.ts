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

import { Puppeteer } from '../index';
// const chalk = require('chalk');
// const Table = require('cli-table');

// const URL = process.env.URL || 'https://www.baidu.com';

const EVENTS = [
  //   'domcontentloaded',
  //   'load',
  //   'networkidle2',
  'networkidle0'
];

// function formatBytesToKB(bytes) {
//   if (bytes > 1024) {
//     const formattedNum = new Intl.NumberFormat('en-US', {
//       maximumFractionDigits: 1
//     }).format(bytes / 1024);
//     return `${formattedNum}KB`;
//   }
//   return `${bytes} bytes`;
// }

// class UsageFormatter {
//   stats: any;
//   constructor(stat) {
//     this.stats = stat;
//   }

//   summary(used = this.stats.usedBytes, total = this.stats.totalBytes) {
//     const percent = Math.round((used / total) * 100);
//     return `${formatBytesToKB(used)}/${formatBytesToKB(total)} (${percent}%)`;
//   }

//   shortSummary(used, total = this.stats.totalBytes) {
//     const percent = Math.round((used / total) * 100);
//     return used ? `${formatBytesToKB(used)} (${percent}%)` : 0;
//   }

//   /**
//    * Constructors a bar chart for the % usage of each value.
//    * @param {!{jsUsed: number, cssUsed: number, totalBytes: number}=} stats Usage stats.
//    * @return {string}
//    */
//   // barGraph(stat = this.stats) {
//   //   // const MAX_TERMINAL_CHARS = process.stdout.columns;
//   //   const maxBarWidth = 30;

//   //   const jsSegment = ' '.repeat((stat.jsUsed / stat.totalBytes) * maxBarWidth);
//   //   const cssSegment = ' '.repeat(
//   //     (stat.cssUsed / stat.totalBytes) * maxBarWidth
//   //   );
//   //   const unusedSegment = ' '.repeat(
//   //     maxBarWidth - jsSegment.length - cssSegment.length
//   //   );

//   //   return (
//   //     chalk.bgRedBright(jsSegment) +
//   //     chalk.bgBlueBright(cssSegment) +
//   //     chalk.bgBlackBright(unusedSegment)
//   //   );
//   // }
// }

const stats = new Map();

/**
 * @param {!Object} coverage
 * @param {string} type Either "css" or "js" to indicate which type of coverage.
 * @param {string} eventType The page event when the coverage was captured.
 */
function addUsage(coverage, type, eventType) {
  for (const entry of coverage) {
    if (!stats.has(entry.url)) {
      stats.set(entry.url, []);
    }

    const urlStats = stats.get(entry.url);

    let eventStats = urlStats.find(item => item.eventType === eventType);
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
        eventType,
        url: entry.url
      };
      urlStats.push(eventStats);
    }

    eventStats.totalBytes += entry.text.length;

    for (const range of entry.ranges) {
      eventStats[`${type}Used`] += range.end - range.start - 1;
    }
  }
}

async function collectCoverage(url: string) {
  const p = new Puppeteer();
  const browser = await p.init();

  // Do separate load for each event. See
  // https://github.com/GoogleChrome/puppeteer/issues/1887
  const collectPromises = EVENTS.map(async event => {
    const page = await browser.newPage();

    await Promise.all([
      page.coverage.startJSCoverage(),
      page.coverage.startCSSCoverage()
    ]);

    await page.goto(url, { waitUntil: event });
    // await page.waitForNavigation({waitUntil: event});

    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage()
    ]);

    addUsage(cssCoverage, 'css', event);
    addUsage(jsCoverage, 'js', event);

    await page.close();
  });

  await Promise.all(collectPromises);

  return browser.close();
}

export async function runCodeCoverage(url: string) {
  await collectCoverage(url);
  const summaryArr = [];
  for (const [_, vals] of stats) {
    EVENTS.forEach(event => {
      const usageForEvent = vals.filter(val => val.eventType === event);

      if (usageForEvent.length) {
        for (const s of usageForEvent) {
          summaryArr.push(s);
        }
      }
    });
  }
  let totalBytes = 0;
  let totalUsedBytes = 0;
  let percentUsed = 0;

  // Print total usage for each event.
  EVENTS.forEach(event => {
    const metrics = Array.from(stats.values());
    metrics.map(eventStatsForUrl => {
      const statsEvent = eventStatsForUrl.filter(
        stat => stat.eventType === event
      )[0];
      // TODO: need to sum max totalBytes. Currently ignores stats if event didn't
      // have an entry. IOW, all total numerators should be max totalBytes seen for that event.
      if (statsEvent) {
        totalBytes += statsEvent.totalBytes;
        totalUsedBytes += statsEvent.usedBytes;
      }
    });

    percentUsed = Math.round((totalUsedBytes / totalBytes) * 100);
  });
  stats.clear();
  return {
    summaryArr,
    totalBytes,
    totalUsedBytes,
    percentUsed
  };
}
