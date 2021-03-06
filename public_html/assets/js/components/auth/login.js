import nunjucks from 'nunjucks';
import updateData from '../common/updateData';
import commonData from '../common/commonData';
import ToggleText from './toggleText';

class Login {
  constructor() {
    const $template = $(nunjucks.render('login.html'));

    this.$phone = $template.find('#login_phone');
    this.$password = $template.find('#srp__password');
    this.form = '#login_form';
    this.$submitbutton = $template.find('#login_srp');

    $('body').append($template);

    this.masked();
    this.authorizationEvent();

    this.toggleButton = new ToggleText(this.$submitbutton);
  }

  authorizationEvent() {
    $('body').on('submit', this.form, (event) => {
      event.preventDefault();
      this.authorization();
    });
  }

  masked() {
    this.$phone.mask(commonData.mask);
  }

  authorization() {
    if (DEBUG) {
      console.log('logging in with SRP, handshaking');
    }
    const srp = new SRP();
    const login = this.$phone.val();
    const password = this.$password.val();

    this.toggleButton.toggle('Установка связи');

    srp.I = login;
    srp.p = password;
    srp.forward_url = '#';
    srp.url = commonData.global_serverJSONUrl;
    srp.error_message = () => {
      this.toggleButton.toggle('Ошибка!');
    };
    srp.success = () => {
      const scrypt = scrypt_module_factory();
      const scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8(`${login}:${password}`), scrypt.encode_utf8(''), 16384, 8, 1, 32);
      const pbkdf = cryptoHelpers.ua2hex(scryptBytes);
      const ls = localStorage;
      const kf = new KeyFile();
      this.toggleButton.toggle('Пароль проверен');
      ls.userId = srp.userId;
      ls.boxId = srp.boxId;

      kf.downloadKeyFile(commonData.global_serverJSONUrl, pbkdf, () => {
        if (DEBUG) {
          console.log('sucessfully logged in with SRP, keyfile downloaded');
        }
        this.toggleButton.toggle('OK!');
        updateData();
      });
    };
    srp.identify();
  }
}


export default Login;
