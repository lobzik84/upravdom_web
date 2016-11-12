import debounce from 'debounce';
import sendCommand from '../common/sendCommand';
import updateNameSettings from '../common/updateNameSettings';
import updateSRP from '../auth/updateSRP';
import settings from '../common/settings';//global config!

class SettingsEvents {
    constructor($target, signName) {
        if ($target[0].type === 'checkbox') {
            $target.on('change', () => {
                SettingsEvents.send();
            });
        } else if ($target[0].tagName === 'FORM') {
            $target.on('submit', (event) => {
                event.preventDefault();

                SettingsEvents.submitForm(event.currentTarget);
            });
        } else {
            $target.on('click', (event) => {
                const sign = signName === 'plus' ? '+' : '-';
                SettingsEvents.switchMinMax(event.currentTarget, sign);
            }).on('click', debounce(() => {
                SettingsEvents.send();
            }, 300));
        }
    }

    static submitForm(currentTarget) {
        const $this = $(currentTarget);
        const $submitButton = $this.find('input.settings__save');

        SettingsEvents.send(() => {
            if (currentTarget.id === 'changePassword') {
                alert('fvsfvd');
                if (settings.connection_type === 'local') {
                    const newPassword = $this.find('.settings__input_new').val();
                    const newLogin = $this.find('.settings__input_phone').val();
                    const oldPass = $this.find('.settings__input_current').val();
                    const confirmPassword = $this.find('.settings__input_confirm').val();
                    if (confirmPassword === newPassword) {
                    const success = () => {
                        if (DEBUG) {
                            console.log('successfully updated password');
                        }
                        $this.attr('disabled', false);
                        $this.find('input').attr('readonly', false);
                        $submitButton.val('Сохранено').removeClass('settings__save_success');
                    }
                    updateSRP(oldPass, newLogin, newPassword, success);}
                    else {
                        alert('Пароли не совпадают');
                    }
                } else {
                    alert('Смена пароля возможна только при прямом подключении');
                }
            } else {

                $this.attr('disabled', false);
                $this.find('input').attr('readonly', false);
                $submitButton.val('Сохранить').removeClass('settings__save_success');
            }
        });
        $submitButton.val('Сохраняем').addClass('settings__save_success');
        $this.attr('disabled', true);
        $this.find('input').attr('readonly', true);

    }

    static switchMinMax(currentTarget, sign) {
        const $target = $(currentTarget);
        const $valueBlock = $target.siblings('.settings-options__value').children('b');
        const count = $valueBlock[0].id === 'settings__value--VACAlertMin' || $valueBlock[0].id === 'settings__value--VACAlertMax' ? 5 : 1;
        let value = parseInt($valueBlock.text().replace(/[^-0-9]/gim, ''), 10);

        if (sign === '+') {
            value += count;
        } else if (sign === '-') {
            value -= count;
        }

        $valueBlock.text(value);
        if (DEBUG) {
            console.log('Saving settings');
        }
    }

    static send(callback) {
        const settingElementIdPrefix = 'settings__value--';
        const settings = {};
        const $settings = $(`[id^="${settingElementIdPrefix}"]`);

        $settings.each((index, setting) => {
            const settingName = setting.id.replace(settingElementIdPrefix, '');

            if (setting.type === 'checkbox') {
                settings[settingName] = `${setting.checked}`;
            } else if (setting.type === 'text') {
                settings[settingName] = setting.value;
            } else {
                settings[settingName] = setting.innerHTML;
            }
            updateNameSettings(settingName, settings[settingName]);
            if (DEBUG) {
                console.log(`${settingName} - ${setting.innerHTML}`);
            }
        });
        sendCommand('save_settings', {settings}, typeof callback === 'function' ? callback : null);
    }
}

export default SettingsEvents;
