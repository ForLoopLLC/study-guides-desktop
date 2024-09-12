import { app, Menu, BrowserWindow } from 'electron';
import { createFileMenu } from './menus/fileMenu';
import { createViewMenu } from './menus/viewMenu';
import { createHelpMenu } from './menus/helpMenu';
import { createScreensMenu } from './menus/screensMenu';
import { createConnectionsMenu } from './menus/connectionsMenu';
import {createEditMenu} from './menus/editMenu';
import { create } from 'domain';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    const isDev =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true';

    if (isDev) {
      this.setupDevelopmentEnvironment();
    }

    const template = [
      createFileMenu(this.mainWindow),
      createEditMenu(this.mainWindow),
      createConnectionsMenu(this.mainWindow),
      createScreensMenu(this.mainWindow),
      createViewMenu(this.mainWindow, isDev),
      createHelpMenu(),
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }
}
