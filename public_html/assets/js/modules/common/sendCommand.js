import postData from './postData';
import settings from './settings';

function sendCommand(name, command_data, successF) {
    var kf = new KeyFile();
    var commandPlain = JSON.stringify(command_data);
    var rsa = new RSAKey();
    rsa.setPrivate(kf.getMyPublicKey(), settings.global_rsa_e, kf.getMyPrivateKey());
    var digest = rsa.signString(commandPlain, "sha256");//generating signature with author's private key
    var publicKey = kf.getBoxKey(kf.boxId);
    rsa = new RSAKey();
    var rng = new SecureRandom();
    var aeskey = (new BigInteger(128, 1, rng)).toString(16);
    rsa.setPublic(publicKey, settings.global_rsa_e);
    var keycipher = rsa.encrypt(aeskey);
    //console.log(aeskey + "," + aeskey.length);
    var bytesToEncrypt = cryptoHelpers.convertStringToByteArray(cryptoHelpers.encode_utf8(commandPlain));//encode to utf8 from unicode, cause aes is sensitive for that, and to byte array
    var key = cryptoHelpers.toNumbers(aeskey);//creating session key
    var cipherBytes = slowAES.encrypt(bytesToEncrypt, settings.global_aes_mode, key, key);//getting message cipher
    var hexEncoded = cryptoHelpers.toHex(cipherBytes)


    var obj = {
        "action": "command",
        "command_name": name,
        "command_data": hexEncoded,
        "digest": digest,
        "key_cipher": keycipher,
        "user_id": kf.userId,
        "box_id": kf.boxId,
        "session_key": localStorage["session_key"]
    }

    postData(obj, successF, null);

}

export default sendCommand;
