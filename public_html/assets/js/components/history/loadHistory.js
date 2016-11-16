import postData from '../common/postData';
import decryptHistory from './decryptHistory';
import updateHistory from './updateHistory';

function loadHistory(from, to, quant, aliases) {
  const kf = new KeyFile();
  const request = {
    action: 'get_history',
    from,
    to,
    quant,
    aliases,
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
