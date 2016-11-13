import commonData from '../common/commonData';


const decryptLog = (kf, data) => {
  let rsa = new RSAKey();
  rsa.setPrivate(kf.getMyPublicKey(), commonData.global_rsa_e, kf.getMyPrivateKey());
  const res = rsa.decrypt(data.key_cipher);
  if (DEBUG) {
    console.log(`symmetric key is ${res}`);
  }

  //  creating key
  const key = cryptoHelpers.toNumbers(res);
  const cipher = data.log;
  //  decoding cipher
  const bytesToDecrypt = cryptoHelpers.toNumbers(cipher);
  // decrypting message
  const bytes = slowAES.decrypt(bytesToDecrypt, commonData.global_aes_mode, key, key);
  //  decoding utf-8
  const plain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(bytes));

  if (DEBUG) {
    console.log(`Log decrypted: ${plain}`);
  }


  const pk = kf.getBoxKey(kf.boxId);
  rsa = new RSAKey();
  rsa.setPublic(pk, commonData.global_rsa_e);
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
};

export default decryptLog;
