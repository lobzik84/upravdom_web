import moment from 'moment';
import commonData from '../common/commonData';

function decryptCapture(kf, data) {
  const rsa = new RSAKey();
  rsa.setPrivate(kf.getMyPublicKey(), commonData.global_rsa_e, kf.getMyPrivateKey());

  for (const camKey in data) {
    try {
      let camNameStr = camKey.toString();
      const begin = Date.now();
      const extIndex = camNameStr.toLowerCase().indexOf('.jpg');

      if (extIndex < 0) {
        continue;
      }

      if (DEBUG) {
        console.log(`decrypting capture ${camNameStr}`);
      }
      camNameStr = camNameStr.substring(0, extIndex);

      const cam = data[camKey];
      const res = rsa.decrypt(cam.key_cipher);

      if (DEBUG) {
        console.log(`symmetric key is ${res}`);
      }

      const key = cryptoHelpers.toNumbers(res); //  creating key
      const cipher = cam.img_cipher;
      const bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //  decoding cipher
      const bytes = slowAES.decrypt(bytesToDecrypt, commonData.global_aes_mode, key, key);
      // decrypting

      const imgDate = cam.img_date;

      const imgElementId = `video_cam_${camNameStr}`;
      const imgElement = document.getElementById(imgElementId);

      if (imgElement !== 'undefined') {
        if (DEBUG) {
          console.log(`Updating element ${imgElementId} size: ${bytes.length}' date: ${imgDate}`);
        }

        imgElement.src = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, bytes))}`;

        const captureDate = moment(imgDate).format('DD.MM.YYYY');
        const captureTime = moment(imgDate).format('HH:mm:ss');

        $('.visual__date').html(`${captureDate},`);
        $('.visual__time').html(`${captureTime}`);

        if (DEBUG) {
          console.log(`${camNameStr} updated, time=${(Date.now() - begin)}ms`);
        }
      }
    } catch (e) {
      console.error(`'error decypting capture ${e}`);
    }
  }
}

export default decryptCapture;
