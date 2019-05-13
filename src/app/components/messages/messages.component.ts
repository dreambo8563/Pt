import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  constructor(
    private electron: ElectronService,
    public messageService: MessageService
  ) {}

  ngOnInit() {}
  collectCode() {
    this.electron.ipcRenderer.on('report', (_: any, r: any) => {
      console.log('get  report in message', r);
    });
    this.electron.ipcRenderer.send('codeCoverage', true);
    // console.log(back);
  }
}
