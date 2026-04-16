const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const loudness = require('loudness');

let mainWindow;

app.disableHardwareAcceleration();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 450,
        height: 650,
        frame: false,
        transparent: true,
        show: false,
        backgroundColor: '#00000000',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const startUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    console.log('--- DIAGNÓSTICO PANDA ---');
    console.log('Diretório atual:', __dirname);
    console.log('Tentando carregar:', startUrl);
    console.log('-------------------------');

    mainWindow.loadURL(startUrl);

    mainWindow.once('ready-to-show', () => {
        console.log('Janela pronta! Mostrando e centralizando...');
        mainWindow.center();
        mainWindow.show();
        mainWindow.focus();
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handler para Controle de Volume
const PANDA_SINK = "alsa_output.pci-0000_03_00.6.analog-stereo";

ipcMain.handle('get-status', async () => {
    try {
        let vol, muted;
        if (process.platform === 'linux') {
            // No Linux, pactl nos dá o volume real (incluindo overdrive)
            const output = await new Promise((resolve) => {
                exec(`pactl get-sink-volume ${PANDA_SINK}`, (err, stdout) => {
                    resolve(stdout || '');
                });
            });
            const muteOutput = await new Promise((resolve) => {
                exec(`pactl get-sink-mute ${PANDA_SINK}`, (err, stdout) => {
                    resolve(stdout || '');
                });
            });

            const match = output.match(/\/ (\d+)%/);
            vol = match ? parseInt(match[1]) : 0;
            muted = muteOutput.includes('yes');
        } else {
            vol = await loudness.getVolume();
            muted = await loudness.getMuted();
        }
        return { volume: vol, muted: muted };
    } catch (err) {
        console.error(err);
        return { volume: 0, muted: false };
    }
});

ipcMain.on('volume-up', async () => {
    if (process.platform === 'linux') {
        exec(`pactl set-sink-volume ${PANDA_SINK} +5%`);
    } else {
        const current = await loudness.getVolume();
        await loudness.setVolume(Math.min(current + 5, 100));
    }
});

ipcMain.on('volume-down', async () => {
    if (process.platform === 'linux') {
        exec(`pactl set-sink-volume ${PANDA_SINK} -5%`);
    } else {
        const current = await loudness.getVolume();
        await loudness.setVolume(Math.max(current - 5, 0));
    }
});

ipcMain.on('toggle-mute', async () => {
    if (process.platform === 'linux') {
        exec(`pactl set-sink-mute ${PANDA_SINK} toggle`);
    } else {
        const current = await loudness.getMuted();
        await loudness.setMuted(!current);
    }
});

ipcMain.on('close-app', () => {
    app.quit();
});
