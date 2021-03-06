import commonData from './commonData';


function decryptData(kf, data) {
  if (DEBUG) {
    console.log(`decrypting \n ${JSON.stringify(data)}`);
  }
  if (typeof kf.getMyPrivateKey() === 'undefined' || kf.getMyPrivateKey().length !== 256) {
      console.error('invalid private key! clearing storage, logging out');
      try {
        clearTimeout(commonData.timeoutVar);
      } catch (e) {}
      localStorage.clear();
      window.location.reload();
      return;
  }
  let rsa = new RSAKey();
  rsa.setPrivate(kf.getMyPublicKey(), commonData.global_rsa_e, kf.getMyPrivateKey());
  const res = rsa.decrypt(data.key_cipher);

  if (DEBUG) {
    console.log(`symmetric key is ${res}`);
  }
  const key = cryptoHelpers.toNumbers(res); //  creating key
  const cipher = data.parameters;
  const bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //  decoding cipher
  const bytes = slowAES.decrypt(bytesToDecrypt, commonData.global_aes_mode, key, key);
  // decrypting message
  const plain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(bytes));
  //  decoding utf-8

  if (DEBUG) {
    console.log(`Parameters decrypted: ${plain}`);
  }

  const notificationCipher = data.notifications;
  const nbytesToDecrypt = cryptoHelpers.toNumbers(notificationCipher); //  decoding cipher
  const nbytes = slowAES.decrypt(nbytesToDecrypt, commonData.global_aes_mode, key, key);
  // decrypting message
  const notificationsPlain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(nbytes));
  //  decoding utf-8

  if (DEBUG) {
    console.log(`notifications decrypted: ${notificationsPlain}`);
  }

  const pk = kf.getBoxKey(kf.boxId);

  rsa = new RSAKey();
  rsa.setPublic(pk, commonData.global_rsa_e);
  const isValid = rsa.verifyString(cipher, data.digest);
  //  checking signature with sender's public key
  if (isValid) {
    if (DEBUG) {
      console.log('Valid digest');
    }
  } else if (DEBUG) {
    console.log('Digest not valid!');
  }
  return {
    plain,
    notificationsPlain,
  };
}

export default decryptData;
