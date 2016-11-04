import nunjucks from 'nunjucks';
import updateData from '../common/updateData';
import settings from '../common/settings';

class Login {
  constructor() {
    const $template = $(nunjucks.render('login.html'));

    this.$phone = $template.find('#login_phone');
    this.$password = $template.find('#srp__password');
    this.form = '#login_form';

    $('body').append($template);

    this.masked();
    this.authorizationEvent();
  }

  authorizationEvent() {
    $('body').on('submit', this.form, (event) => {
      event.preventDefault();
      this.authorization();
    });
  }

  masked() {
    this.$phone.mask(settings.mask);
  }

  authorization() {
    if (DEBUG) {
      console.log('logging in with SRP, handshaking');
    }
    const srp = new SRP();
    const login = this.$phone.val();
    const password = this.$password.val();

    srp.I = login;
    srp.p = password;
    srp.forward_url = '#';
    srp.url = settings.global_serverJSONUrl;
    srp.success = () => {
      const scrypt = scrypt_module_factory();
      const scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8(`${login}:${password}`), scrypt.encode_utf8(''), 16384, 8, 1, 32);
      const pbkdf = cryptoHelpers.ua2hex(scryptBytes);
      const ls = localStorage;
      const kf = new KeyFile();

      ls.userId = srp.userId;
      ls.boxId = srp.boxId;

      kf.downloadKeyFile(settings.global_serverJSONUrl, pbkdf, () => {
        if (DEBUG) {
          console.log('sucessfully logged in with SRP, keyfile downloaded');
        }
        updateData();
      });
    };
    srp.identify();
  }
}


export default Login;
