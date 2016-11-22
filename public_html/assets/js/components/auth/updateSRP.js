import commonData from '../common/commonData';

function updateSRP(oldPassword, newLogin, newPassword, successF, errorF) {
    if (DEBUG) {
        console.log('updating password. looging in with SRP, handshaking');
    }
    const oldLogin = commonData.user_login;

    const newSrp = new SRP();
    newSrp.I = newLogin;
    newSrp.p = newPassword;

    const newSalt = newSrp.generateSalt();
    const newVerifier = newSrp.getVerifier();

    const srp = new SRP();

    srp.I = oldLogin;
    srp.p = oldPassword;

    srp.forward_url = '#';
    srp.url = commonData.global_serverJSONUrl;
    const scrypt = scrypt_module_factory();
    const scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8(`${newLogin}:${newPassword}`), scrypt.encode_utf8(''), 16384, 8, 1, 32);
    const pbkdf = cryptoHelpers.ua2hex(scryptBytes);
    const kfNew = new KeyFile();
    const newKeyFile = kfNew.getKeyFileAsEncryptedStirng(pbkdf);

    srp.success = () => {
        if (DEBUG) {
            console.log('login, s, v, keyfile uploaded');
        }
        commonData.user_login = newLogin;

        localStorage.pbkdf = pbkdf;

        localStorage[`${localStorage.userId}.${localStorage.boxId}.pbkdf`] = pbkdf;

        if (successF !== null && typeof successF === 'function') {
            successF();
        }

    };

    srp.error_message = () => {
        if (errorF !== null && typeof errorF === 'function') {
            errorF();
        }
    }

    srp.updatePassword(newLogin, newSalt, newVerifier, newKeyFile);
}

export default updateSRP;
