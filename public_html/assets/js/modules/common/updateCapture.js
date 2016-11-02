import postData from './postData';
import decryptCapture from './decryptCapture';
import settings from './settings';

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
      if (settings.print_debug_to_console) {
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
