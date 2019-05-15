import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { AppConfig } from '../environments/environment';
import { MatTableDataSource, MatSort } from '@angular/material';
import {
  trigger,
  transition,
  style,
  animate,
  state,
  keyframes
} from '@angular/animations';

// import { FormControl, Validators } from '@angular/forms';
export interface CoverageRow {
  url: string;
  jsUsed: number;
  cssUsed: number;
  shortSummary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('lighthouseBtnAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('3s', style({ opacity: 1 }))
      ])
    ]),
    trigger('searchStates', [
      state(
        'searching',
        style({
          transform: 'scale(0.1)',
          opacity: 0.5
        })
      ),
      state(
        'done',
        style({
          transform: 'scale(1)',
          opacity: 1
        })
      ),
      transition('done => searching', [animate('1s')]),
      transition('searching => done', [animate('0.5s')])
    ])
  ]
})
export class AppComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  url: string;
  searching = false;

  displayedColumns: string[] = ['url', 'jsUsed', 'cssUsed', 'shortSummary'];
  dataSource: MatTableDataSource<CoverageRow>;

  constructor(
    private electronService: ElectronService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    console.log('AppConfig', AppConfig);
    this.dataSource = new MatTableDataSource<CoverageRow>();

    if (electronService.isElectron()) {
      console.log('Mode electron');
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.electronService.ipcRenderer.on('report', (_: any, r: any) => {
      this.searching = false;
      const { coverage } = r;
      this.dataSource.data = coverage.summaryArr.map(
        ({ url, jsUsed, cssUsed, usedBytes, totalBytes, percentUsed }) => ({
          url,
          jsUsed,
          cssUsed,
          usedBytes,
          totalBytes,
          percentUsed
        })
      );

      this.refresPage();
    });
    this.electronService.ipcRenderer.on(
      'report.error',
      (_: any, err: string) => {
        this.searching = false;

        this.electronService.sendMessage({
          title: 'error',
          body: err
        });
        this.refresPage();
      }
    );
  }
  collectCode() {
    this.searching = true;
    this.electronService.ipcRenderer.send('codeCoverage', this.url);
  }
  refresPage() {
    this.changeDetectorRefs.detectChanges();
  }

  search() {
    const isValid = this.urlCheck();
    if (isValid) {
      this.collectCode();
    }
  }
  showLighthouse() {
    this.electronService.ipcRenderer.send('lighthouse.report', true);
  }
  urlCheck() {
    if (!this.url) {
      this.electronService.sendMessage({
        title: 'warning',
        body: 'Please input the whole URL'
      });
      return false;
    }
    if (!(this.url.startsWith('http') || this.url.startsWith('https'))) {
      this.electronService.sendMessage({
        title: 'warning',
        body: 'the URL should starts with http/https'
      });
      return false;
    }
    return true;
  }
}
