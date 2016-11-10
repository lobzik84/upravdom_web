import postData from './postData';
import decryptHistory from './decryptHistory';
import updateHistory from '../main/updateHistory';

function loadHistory(from, to, quant) {
  const kf = new KeyFile();

  const request = {
    action: 'get_history',
    from,
    to,
    quant,
    user_id: kf.userId,
    box_id: kf.boxId,
    session_key: localStorage.session_key,
  };

  const success = (data) => {
    if (data.result === 'success') {
      localStorage.session_key = data.session_key;
      if (DEBUG) {
        console.log('successfully loaded history, decrypting');
        console.log(data);
      }
      const decrypt = decryptHistory(kf, data);
      updateHistory(decrypt);
    }
  };

  const fail = () => {
    console.error('network error while getting history');
  };

  postData(request, success, fail);
}

export default loadHistory;
