import settings from './settings';


function decryptData(kf, data) {
  if (DEBUG) {
    console.log(`decrypting \n ${JSON.stringify(data)}`);
  }
  let rsa = new RSAKey();
  rsa.setPrivate(kf.getMyPublicKey(), settings.global_rsa_e, kf.getMyPrivateKey());
  const res = rsa.decrypt(data.key_cipher);

  if (DEBUG) {
    console.log(`symmetric key is ${res}`);
  }
  const key = cryptoHelpers.toNumbers(res); //  creating key
  const cipher = data.parameters;
  const bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //  decoding cipher
  const bytes = slowAES.decrypt(bytesToDecrypt, settings.global_aes_mode, key, key);
  // decrypting message
  const plain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(bytes));
  //  decoding utf-8

  if (DEBUG) {
    console.log(`Parameters decrypted: ${plain}`);
  }

  const notificationCipher = data.notifications;
  const nbytesToDecrypt = cryptoHelpers.toNumbers(notificationCipher); //  decoding cipher
  const nbytes = slowAES.decrypt(nbytesToDecrypt, settings.global_aes_mode, key, key);
  // decrypting message
  const notificationsPlain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(nbytes));
  //  decoding utf-8

  if (DEBUG) {
    console.log(`notifications decrypted: ${notificationsPlain}`);
  }

  const pk = kf.getBoxKey(kf.boxId);

  rsa = new RSAKey();
  rsa.setPublic(pk, settings.global_rsa_e);
  const isValid = rsa.verifyString(cipher, data.digest);
  //  checking signature with sender's public key
  if (isValid) {
    if (DEBUG) {
      console.log('Valid digest');
    }
  } else if (DEBUG) {
    console.log('Digest not valid!');
  }
  return plain;
}

export default decryptData;
