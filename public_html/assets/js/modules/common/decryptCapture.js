import settings from './settings';


function decryptCapture(kf, data) {
  var rsa = new RSAKey();
  rsa.setPrivate(kf.getMyPublicKey(), settings.global_rsa_e, kf.getMyPrivateKey());

  for (var camKey in data) {
      try {
          var camNameStr = camKey.toString();
          var begin = Date.now();
          var extIndex = camNameStr.toLowerCase().indexOf(".jpg");
          if (extIndex < 0)
              continue;

          if (DEBUG) {
            console.log("decrypting capture " + camNameStr);
          }
          camNameStr = camNameStr.substring(0, extIndex);
          var cam = data[camKey];
          var res = rsa.decrypt(cam["key_cipher"]);
          if (DEBUG)
              console.log("symmetric key is " + res);
          var key = cryptoHelpers.toNumbers(res); //creating key
          var cipher = cam["img_cipher"];
          var bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //decoding cipher
          var bytes = slowAES.decrypt(bytesToDecrypt, settings.global_aes_mode, key, key); //decrypting

          var imgDate = cam["img_date"];

          var imgElementId = "video_cam_" + camNameStr;
          var imgElement = document.getElementById(imgElementId);
          if (imgElement !== "undefined") {
              if (DEBUG) {
                console.log("Updating element " + imgElementId + " size: " + bytes.length + " date: " + imgDate);
              }
              imgElement.src = "data:image/jpeg;base64," + btoa(String.fromCharCode.apply(null, bytes));
              var captureDate = new Date(imgDate);
              $("#video--date").html(captureDate.getDay() + "." + captureDate.getMonth() + "." + captureDate.getFullYear() + ",");

              $("#video--time").html(captureDate.getHours() + ":" + captureDate.getMinutes());
              if (DEBUG)
                  console.log(camNameStr + " updated, time=" + (Date.now() - begin) + " ms");
          }

      } catch (e) {
          console.error("error decypting capture " + e);
      }
  }
}

export default decryptCapture;
