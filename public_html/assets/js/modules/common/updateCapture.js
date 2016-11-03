import postData from './postData';
import decryptCapture from './decryptCapture';

function updateCapture() {
  const kf = new KeyFile();

  const params = {
    action: 'get_capture',
    user_id: kf.userId,
    box_id: kf.boxId,
    session_key: localStorage.session_key,
  };

  const success = (data) => {
    if (data.result === 'success') {
      localStorage.session_key = data.session_key;
      if (DEBUG) {
        console.log('successfully loaded capture, decrypting');
      }
      decryptCapture(kf, data);
    }
  };
  const fail = () => {
    console.error('network error while getting capture');
  };

  postData(params, success, fail);
}

export default updateCapture;
