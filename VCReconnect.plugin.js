/**
 * @name VCReconnect
 * @author KevDaDev
 * @description Reconnect to vc
 * @version 0.2.0
 */

const defaultSettings = {
    channelId: '',
    userName: '',
    reconnectCheckInterval: 10000
}
module.exports = class VCReconnect {
    settings = defaultSettings;
    intervalKey = null;
    isLocked = false;
    rejoinCount = 0;

    createLockButton() {
        const buttonsPane = document.querySelector('section[aria-label="User area"]');
        const lockButtonContainer = document.createElement('div');
        const lockButton = document.createElement('button');

        lockButtonContainer.classList.add('container_e1958d', 'actionButtons__85e3c');
        lockButtonContainer.style = 'padding-top: 8px';
        lockButtonContainer.id = 'VCReconnectLockButtonContainer';

        lockButton.id = 'VCReconnectLockButton';
        lockButton.classList.add('button__581d0', 'buttonColor__7bad9', 'button_b82d53', 'colorBrand__27d57', 'sizeSmall_da7d10', 'grow__4c8a4', 'button_b82d53');
        lockButton.onclick = () => {
            if (this.isLocked) {
                this.unlockVc();
            } else {
                this.lockVc();
            }
            this.updateLockButtonText();
        }

        lockButtonContainer.appendChild(lockButton);
        buttonsPane.insertBefore(lockButtonContainer, buttonsPane.lastChild);

        this.updateLockButtonText();
    }

    updateLockButtonText() {
        const lockButton = document.getElementById('VCReconnectLockButton');
        if (lockButton) {
            lockButton.innerHTML = (this.isLocked ? 'Unlock' : 'Lock') + ` VC (${this.rejoinCount} rejoin attempts)`;
            if(this.isLocked) {
                lockButton.classList.add('buttonActive_ae686f');
            }
            else {
                lockButton.classList.remove('buttonActive_ae686f');
            }
        }
    }

    lockVc() {
        const vc = document.querySelector(`[data-list-item-id="channels___${this.settings.channelId}"]`);

        if (!vc) {
            BdApi.showToast('VC not found. Make sure you are in the correct server', {type: 'error'});
            return;
        }

        this.startReconnectInterval();

        this.isLocked = true;
        BdApi.showToast('VC is now locked', {type: 'info'});
    }

    startReconnectInterval() {
        if (this.intervalKey) {
            clearInterval(this.intervalKey);
        }

        this.intervalKey = setInterval(() => {
            const vc = document.querySelector(`[data-list-item-id="channels___${this.settings.channelId}"]`);

            if (!vc) {
                BdApi.showToast('VC not found', {type: 'error'});
                return;
            }

            const members = vc.closest('li').querySelector(`div[role="group"]`).children;

            for (let i = 0; i < members.length; i++) {
                const username = members[i].querySelector('div[class^="username"]');
                if (username.innerHTML === this.settings.userName) {
                    console.log('User is in vc');
                    return;
                }
            }
            BdApi.showToast('Reconnecting to vc', {type: 'info'});
            vc.click();
            this.rejoinCount++;
            this.updateLockButtonText();
        }, this.settings.reconnectCheckInterval);
    }

    unlockVc() {
        if (this.intervalKey) {
            clearInterval(this.intervalKey);
        }
        this.isLocked = false;

        BdApi.showToast('VC is now unlocked', {type: 'info'});
    }

    start() {
        this.settings = Object.assign(defaultSettings, BdApi.getData('VCReconnect', 'settings'));

        this.createLockButton();
    }

    stop() {
        clearInterval(this.intervalKey);
        //remove lock button from ui
        const lockButton = document.getElementById('VCReconnectLockButtonContainer');
        if (lockButton) {
            lockButton.remove();
        }
    }

    getSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'VCReconnectSettingsPanel';

        const settingsTitle = document.createElement('h2');
        settingsTitle.innerHTML = 'VCReconnect Settings';

        const channelIdLabel = document.createElement('label');
        channelIdLabel.innerHTML = 'Channel ID';

        const channelIdInput = document.createElement('input');
        channelIdInput.type = 'text';
        channelIdInput.placeholder = 'Channel ID';
        channelIdInput.value = this.settings.channelId;
        channelIdInput.onchange = (e) => {
            this.settings.channelId = e.target.value;
            BdApi.setData('VCReconnect', 'settings', this.settings);

            if (this.isLocked) {
                this.startReconnectInterval();
            }
        }


        const userNameLabel = document.createElement('label');
        userNameLabel.innerHTML = 'Username';

        const userNameInput = document.createElement('input');
        userNameInput.type = 'text';
        userNameInput.placeholder = 'Username';
        userNameInput.value = this.settings.userName;
        userNameInput.onchange = (e) => {
            this.settings.userName = e.target.value;
            BdApi.setData('VCReconnect', 'settings', this.settings);

            if (this.isLocked) {
                this.startReconnectInterval();
            }
        }


        const reconnectCheckIntervalLabel = document.createElement('label');
        reconnectCheckIntervalLabel.innerHTML = 'Reconnect check interval';

        const reconnectCheckIntervalInput = document.createElement('input');
        reconnectCheckIntervalInput.type = 'number';
        reconnectCheckIntervalInput.placeholder = 'Reconnect check interval';
        reconnectCheckIntervalInput.value = this.settings.reconnectCheckInterval;
        reconnectCheckIntervalInput.onchange = (e) => {
            this.settings.reconnectCheckInterval = e.target.value;
            BdApi.setData('VCReconnect', 'settings', this.settings);

            if (this.isLocked) {
                this.startReconnectInterval();
            }
        }


        settingsPanel.appendChild(settingsTitle);

        settingsPanel.appendChild(channelIdLabel);
        settingsPanel.appendChild(channelIdInput);

        settingsPanel.appendChild(userNameLabel);
        settingsPanel.appendChild(userNameInput);

        settingsPanel.appendChild(reconnectCheckIntervalLabel);
        settingsPanel.appendChild(reconnectCheckIntervalInput);

        return settingsPanel;
    }
}