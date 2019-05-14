"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// regerister channel
electron_1.ipcMain.on('message', function (event, ops) {
    var supported = electron_1.Notification.isSupported();
    if (supported) {
        // tslint:disable-next-line:no-unused-expression
        var n = new electron_1.Notification(ops);
        n.show();
    }
});
//# sourceMappingURL=index.js.map