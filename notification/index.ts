import { ipcMain, Notification } from 'electron';
// regerister channel
ipcMain.on('message', (event, ops: { title: string; body: string }) => {
  const supported = Notification.isSupported();
  if (supported) {
    // tslint:disable-next-line:no-unused-expression
    const n = new Notification(ops);
    n.show();
  }
});
