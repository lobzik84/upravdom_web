import settings from './settings';


function decryptLog(kf, data) {

  let rsa = new RSAKey();
  rsa.setPrivate(kf.getMyPublicKey(), settings.global_rsa_e, kf.getMyPrivateKey());
  const res = rsa.decrypt(data.key_cipher);
  if (DEBUG) {
    console.log(`symmetric key is ${res}`);
  }
  const key = cryptoHelpers.toNumbers(res); //  creating key
  const cipher = data.log;
  const bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //  decoding cipher
  const bytes = slowAES.decrypt(bytesToDecrypt, settings.global_aes_mode, key, key);
  // decrypting message
  const plain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(bytes));
  //  decoding utf-8

  if (DEBUG) {
    console.log(`Log decrypted: ${plain}`);
  }


  const pk = kf.getBoxKey(kf.boxId);
  rsa = new RSAKey();
  rsa.setPublic(pk, settings.global_rsa_e);
  const isValid = rsa.verifyString(cipher, data.digest);
  //  checking signature with sender's public key
  if (DEBUG) {
    if (isValid) {
      console.log('Valid digest');
    } else {
      console.log('Digest not valid!');
    }
  }
  return {
    plain,
  };
}

export default decryptLog;
