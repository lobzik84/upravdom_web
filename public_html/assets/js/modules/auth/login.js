import nunjucks from 'nunjucks';
import updateData from '../common/updateData';
import settings from '../common/settings';

class Login {
  constructor() {
    const $template = $(nunjucks.render('login.html'));
    this.$phone = $template.find('#login_phone');
    this.$password = $template.find('#srp__password');
    this.$button = $template.find('#login_srp');
    $('body').append($template);

    this.masked();
    this.authorizationEvent();
  }

  authorizationEvent() {
    this.$button.on('click', () => {
      this.authorization();
    });
  }

  masked() {
    this.$phone.mask(settings.mask);
  }

  authorization() {
    if (settings.print_debug_to_console) {
      console.log("logging in with SRP, handshaking");
    }
    var srp = new SRP();
    var login = this.$phone.val();
    var password = this.$password.val();
    srp.I = login;
    srp.p = password;
    srp.forward_url = "#";
    srp.url = settings.global_serverJSONUrl;
    srp.success = function () {
        var scrypt = scrypt_module_factory();
        var scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8(login + ":" + password), scrypt.encode_utf8(""), 16384, 8, 1, 32);
        var pbkdf = cryptoHelpers.ua2hex(scryptBytes);
        var ls = localStorage;
        var kf = new KeyFile();

        ls["userId"] = srp.userId;
        ls["boxId"] = srp.boxId;

        kf.downloadKeyFile(settings.global_serverJSONUrl, pbkdf, () => {
          if (settings.print_debug_to_console) {
            console.log("sucessfully logged in with SRP, keyfile downloaded");
          }
          updateData();
        });
    }
    srp.identify();
  }
}


export default Login;
