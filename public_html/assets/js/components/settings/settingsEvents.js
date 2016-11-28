import debounce from 'debounce';
import sendCommand from '../common/sendCommand';
import updateNameSettings from './updateNameSettings';
import updateSRP from '../auth/updateSRP';
import commonData from '../common/commonData'; // global config!
import ToggleText from '../auth/toggleText';

class SettingsEvents {
    constructor($target, signName) {


        if ($target[0].type === 'checkbox') {
            $target.on('change', () => {
                SettingsEvents.send();
            });
        } else if ($target[0].tagName === 'FORM') {
            $target.on('submit', (event) => {
                event.preventDefault();
                const currentTarget = event.currentTarget;
                if (currentTarget.id === 'changePassword') {
                    this.replacePassword(currentTarget);
                } else {
                    this.submitForm(currentTarget);
                }
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

    submitForm(currentTarget) {


        const $this = $(currentTarget);
        const $submitButton = $this.find('#settings_save_profile');
        const toggleButtonProfile = new ToggleText($submitButton);
        const $email = $this.find('.settings__input_email');
        toggleButtonProfile.toggle('Сохраняем');
        if ($email.val().length === 0 && !commonData.email.test($email.val())) {
            this.toggleButtonProfile.toggle('Введите электронную почту');
            return false;
        }

        if (DEBUG) {
            console.log('replace submitForm');
        }

        SettingsEvents.send(() => {
            $this.attr('disabled', false);
            $this.find('input').attr('readonly', false);
            $submitButton.removeClass('settings__save_success');
        });
        toggleButtonProfile.toggle('Сохранено');
    }

    replacePassword(currentTarget) {
        const $this = $(currentTarget);
        const $submitButton = $this.find('#settings_save_password');
        const toggleButtonPassword = new ToggleText($submitButton);

        SettingsEvents.send(() => {
            if (DEBUG) {
                console.log('replace password');
            }
            const newPassword = $this.find('.settings__input_new').val();
            if (!SettingsEvents.validatePassword(newPassword)) {
                toggleButtonPassword.toggle('Слишком короткий пароль');
            }else if (commonData.connection_type === 'local') {
                toggleButtonPassword.toggle('Сохраняем');
                const newLogin = $this.find('.settings__input_phone').val();
                const oldPass = $this.find('.settings__input_current').val();
                const confirmPassword = $this.find('.settings__input_confirm').val();
                if (confirmPassword === newPassword && newPassword.length > 0) {
                    const success = () => {
                        if (DEBUG) {
                            console.log('successfully updated password');
                        }
                        toggleButtonPassword.toggle('Сохранено');
                    }
                    const error = () => {
                        if (DEBUG) {
                            console.log('SRP error while updating password');
                        }
                        toggleButtonPassword.toggle('Ошибка');

                    }
                    updateSRP(oldPass, newLogin, newPassword, success, error);
                } else {
                    toggleButtonPassword.toggle('Пароли не совпадают');
                }
            } else {
                alert(`Смена пароля возможна только при прямом подключении ${commonData.connection_type}`);
            }
        });

    }
    
    static validatePassword(newPassword) {
               
        return (newPassword.length > commonData.passwordlength);
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
            } else if (setting.type === 'text' || setting.type === 'email') {
                settings[settingName] = setting.value;
            } else {
                settings[settingName] = setting.innerHTML;
            }
            updateNameSettings(settingName, settings[settingName]);
            if (DEBUG) {
                console.log(`${settingName} - ${setting.innerHTML}`);
            }
        });
        sendCommand('save_settings', {
            settings
        }, typeof callback === 'function' ? callback : null);
    }
}

export default SettingsEvents;
