import settings from '../common/settings';

function updateLoginPassword(oldPassword, newLogin, newPassword, successF) {
  if (DEBUG) {
    console.log('updating password. looging in with SRP, handshaking');
  }
  const oldLogin = settings.user_login;

  const newSrp = new SRP();
  newSrp.I = newLogin;
  newSrp.p = newPassword;

  const newSalt = newSrp.generateSalt();
  const newVerifier = newSrp.getVerifier();

  const srp = new SRP();

  srp.I = oldLogin;
  srp.p = oldPassword;

  srp.forward_url = '#';
  srp.url = settings.global_serverJSONUrl;
  srp.success = () => {
    if (DEBUG) {
      console.log('login, s, v uploaded, updating keyfile');
    }
    settings.user_login = newLogin;
    const scrypt = scrypt_module_factory();
    const scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8(`${newLogin}:${newPassword}`), scrypt.encode_utf8(''), 16384, 8, 1, 32);
    const pbkdf = cryptoHelpers.ua2hex(scryptBytes);
    localStorage.pbkdf = pbkdf;
    const kf = new KeyFile();
    localStorage[`${localStorage.userId}.${localStorage.boxId}.pbkdf`] = pbkdf;
    kf.uploadKeyFile(settings.global_serverJSONUrl, () => {
      if (kf.xhr.readyState === 4 && kf.xhr.status === 200) {
        if (successF !== null && typeof successF === 'function') {
          successF();
        }
      }
    });
  };

  srp.updatePassword(newLogin, newSalt, newVerifier);
}

export default updateLoginPassword;
