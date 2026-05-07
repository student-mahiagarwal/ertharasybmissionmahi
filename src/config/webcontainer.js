import { WebContainer } from '@webcontainer/api';

let webContainerInstance = null;

export async function getWebContainer() {
    if (!webContainerInstance) {
        webContainerInstance = await WebContainer.boot();
    }

    return webContainerInstance;
}
