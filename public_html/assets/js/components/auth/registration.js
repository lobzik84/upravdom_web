import nunjucks from 'nunjucks';
import commonData from '../common/commonData';
import updateData from '../common/updateData';
import postData from '../common/postData';
import ToggleText from './toggleText';


class Registration {
    constructor() {
        const $template = $(nunjucks.render('registration.html'));
        this.$phone = $template.find('#phone');
        this.form = '#registration_form';
        this.$submitbutton = $template.find('#register');
        this.toggleButton = new ToggleText(this.$submitbutton);

        $('body').append($template);

        this.masked();

        $('body').on('submit', this.form, (event) => {
            event.preventDefault();
            if ($('#new__password').val() === $('#new__password_repeat').val()) {
                if (Registration.validatePassword()) {
                    this.register();
                } else {
                    this.toggleButton.toggle('Слишком короткий пароль');
                }
            } else {
                this.toggleButton.toggle('Пароли не совпадают!');
            }

        });
    }

    masked() {
        this.$phone.mask(commonData.mask);
    }

    static validatePassword() {
        return ($('#new__password').val().length > commonData.passwordlength);
    }

    register() {
        const rsa = new RSAKey();

        if (DEBUG) {
            console.log('generating RSA...');
        }
        rsa.generate(1024, commonData.global_rsa_e); // 1024 bits, public exponent = 10001
        if (DEBUG) {
            console.log('RSA generated, generating salt');
        }
        const srp = new SRP();
        const login = $('#phone').val();

        srp.I = login;
        srp.p = $('#new__password').val(); // TODO check passwords are similiar

        const salt = srp.generateSalt();
        const verifier = srp.getVerifier();
        const public_key = rsa.n.toString(16);

        if (DEBUG) {
            console.log(`Generated s=${salt}, v=${verifier}, public key=${public_key} for login ${login}, password ${srp.p}`);
        }

        const registrationSettings = {
            action: 'register',
            login,
            salt,
            verifier,
            public_key,
        };

        const success = (data) => {
            if (data.result === 'success') {
                const scrypt = scrypt_module_factory();
                const phone = $('#phone').val();
                const password = $('#new__password').val();
                const scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8(`${phone}:${password}`), scrypt.encode_utf8(''), 16384, 8, 1, 32);
                const pbkdf = cryptoHelpers.ua2hex(scryptBytes);
                const kf = new KeyFile();

                kf.initKeyFile(data.new_user_id, data.box_id, rsa.d.toString(16), rsa.n.toString(16), pbkdf);
                kf.addBoxKey(data.box_id, data.box_public_key);
                this.toggleButton.toggle('ОК!');
                localStorage.session_key = data.session_key;
                if (DEBUG) {
                    console.log(`created keyfile: \n${kf.getKeyFileAsStirng()}`);
                }
                kf.uploadKeyFile(commonData.global_serverJSONUrl, function () {
                    if (kf.xhr.readyState === 4 && kf.xhr.status === 200) {
                        //alert(`Successfully registered! UserId = ${data.new_user_id}`);
                        
                        updateData();
                    }
                });
            } else {
                alert(`Error while registering: ${data.message}`);
            }
        };
        postData(registrationSettings, success, () => {
            alert('Error while registering');
        });
    }
}

export default Registration;
