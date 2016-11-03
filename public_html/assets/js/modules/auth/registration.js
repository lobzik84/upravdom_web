import nunjucks from 'nunjucks';
import settings from '../common/settings';
import updateData from '../common/updateData';
import postData from '../common/postData';

class Registration {
  constructor() {
    const $template = $(nunjucks.render('registration.html'));
    this.$phone = $template.find('#phone');
    this.$button = $template.find('#register');

    $('body').append($template);

    this.masked();

    this.$button.on('click', () => {
      Registration.registered();
    });
  }

  masked() {
    this.$phone.mask(settings.mask);
  }

  static registered() {
    var rsa = new RSAKey();

    if (DEBUG) {
      console.log("generating RSA...");
    }
    rsa.generate(1024, settings.global_rsa_e); //1024 bits, public exponent = 10001
    if (DEBUG)
      console.log("RSA generated, generating salt");
    var srp = new SRP();
    var login = $("#phone").val();
    srp.I = login;
    srp.p = $("#new__password").val(); //TODO check passwords are similiar

    var salt = srp.generateSalt();
    var verifier = srp.getVerifier();
    var publicKey = rsa.n.toString(16);
    if (DEBUG)
      console.log("Generated s=" + salt + ", v=" + verifier + ", public key=" + publicKey + " for login " + login + ", password " + srp.p);

    var regObj = {
      "action": "register",
      "login": login,
      "salt": salt,
      "verifier": verifier,
      "public_key": publicKey
    }
    var success = function (data) {
      if (data["result"] === "success") {
        var scrypt = scrypt_module_factory();
        var scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8($("#phone").val() + ":" + $("#new__password").val()), scrypt.encode_utf8(""), 16384, 8, 1, 32);
        var pbkdf = cryptoHelpers.ua2hex(scryptBytes);
        var kf = new KeyFile();
        kf.initKeyFile(data["new_user_id"], data["box_id"], rsa.d.toString(16), rsa.n.toString(16), pbkdf);
        kf.addBoxKey(data["box_id"], data["box_public_key"]);
        localStorage["session_key"] = data["session_key"];
        if (DEBUG) {
          console.log("created keyfile: \n" + kf.getKeyFileAsStirng());
        }
        kf.uploadKeyFile(settings.global_serverJSONUrl, function () {
          if (kf.xhr.readyState === 4 && kf.xhr.status === 200) {
            alert("Successfully registered! UserId = " + data["new_user_id"]);
            // $('.registration').hide();
            $('.home').show();
            updateData();
          }
        });
      } else {
        alert("Error while registering: " + data["message"]);
      }
    }
    postData(regObj, success, function () {
      alert("Error while registering");
    });
  }
}

export default Registration;
