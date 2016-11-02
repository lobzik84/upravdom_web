import postData from './postData';
import settings from './settings';

function sendCommand(name, commandData, success) {
  const kf = new KeyFile();
  const commandPlain = JSON.stringify(commandData);
  let rsa = new RSAKey();
  rsa.setPrivate(kf.getMyPublicKey(), settings.global_rsa_e, kf.getMyPrivateKey());

  const digest = rsa.signString(commandPlain, 'sha256'); // generating signature with author's private key
  const publicKey = kf.getBoxKey(kf.boxId);
  rsa = new RSAKey();
  const rng = new SecureRandom();
  const aeskey = (new BigInteger(128, 1, rng)).toString(16);
  rsa.setPublic(publicKey, settings.global_rsa_e);

  const keycipher = rsa.encrypt(aeskey);
  const bytesToEncrypt = cryptoHelpers.convertStringToByteArray(cryptoHelpers.encode_utf8(commandPlain));
  //  encode to utf8 from unicode, cause aes is sensitive for that, and to byte array
  const key = cryptoHelpers.toNumbers(aeskey); // creating session key
  const cipherBytes = slowAES.encrypt(bytesToEncrypt, settings.global_aes_mode, key, key);
    //  getting message cipher
  const hexEncoded = cryptoHelpers.toHex(cipherBytes)


  const params = {
    action: 'command',
    command_name: name,
    command_data: hexEncoded,
    digest,
    key_cipher: keycipher,
    user_id: kf.userId,
    box_id: kf.boxId,
    session_key: localStorage.session_key,
  };

  postData(params, success, null);
}

export default sendCommand;
