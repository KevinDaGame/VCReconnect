/**
 * @name VCReconnect
 * @author KevDaDev
 * @description Reconnect to vc
 * @version 0.0.1
 */
module.exports = class VCReconnect {
    channelId = '1151086880604033067';
    userName = 'KevDaDev'
    interval = 3000;
    intervalKey = null;
    isLocked = false;

    createLockButton() {
        const buttonsPane = document.querySelector('section[aria-label="User area"]');
        const lockButton = document.createElement('button');

        lockButton.id = 'VCReconnectLockButton';
        lockButton.classList.add('button__66e8c', 'buttonColor_a6eb73', 'button_afdfd9', 'colorBrand_b2253e', 'sizeSmall__71a98', 'grow__4c8a4', 'button__66e8c');
        lockButton.innerHTML = 'Lock';
        lockButton.onclick = () => {
            if (this.isLocked) {
                this.unlockVc();
            } else {
                this.lockVc();
            }
            this.updateLockButtonText();
        }
        buttonsPane.insertBefore(lockButton, buttonsPane.lastChild);

    }

    updateLockButtonText() {
        const lockButton = document.getElementById('VCReconnectLockButton');
        if (lockButton) {
            lockButton.innerHTML = this.isLocked ? 'Unlock' : 'Lock';
            if(this.isLocked) {
                lockButton.classList.add('buttonActive__407a7');
            }
            else {
                lockButton.classList.remove('buttonActive__407a7');
            }
        }
    }

    lockVc() {
        const vc = document.querySelector(`[data-list-item-id="channels___${this.channelId}"]`);

        if (!vc) {
            BdApi.showToast('VC not found', {type: 'error'});
            return;
        }

        this.intervalKey = setInterval(() => {
            const vc = document.querySelector(`[data-list-item-id="channels___${this.channelId}"]`);

            if (!vc) {
                BdApi.showToast('VC not found', {type: 'error'});
                return;
            }

            const members = vc.closest('li').querySelector(`div[role="group"]`).children;

            for (let i = 0; i < members.length; i++) {
                const username = members[i].querySelector('div.usernameFont__71dd5.username__73ce9');
                if (username.innerHTML === this.userName) {
                    console.log('User is in vc');
                    return;
                }
            }
            BdApi.showToast('Reconnecting to vc', {type: 'info'});
            vc.click();
        }, this.interval);

        this.isLocked = true;
        BdApi.showToast('VC is now locked', {type: 'info'});
    }

    unlockVc() {
        if (this.intervalKey) {
            clearInterval(this.intervalKey);
        }
        this.isLocked = false;

        BdApi.showToast('VC is now unlocked', {type: 'info'});
    }

    start() {
        this.createLockButton();
    }

    stop() {
        clearInterval(this.intervalKey);
        //remove lock button from ui
        const lockButton = document.getElementById('VCReconnectLockButton');
        if (lockButton) {
            lockButton.remove();
        }
    }
}