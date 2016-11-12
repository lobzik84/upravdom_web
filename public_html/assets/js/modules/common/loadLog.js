import postData from './postData';
import decryptLog from './decryptLog';
import updateLog from './updateLog';


function loadLog(from, to, module_name, severity) {
  const kf = new KeyFile();

  const request = {
    action: 'get_log',
    from,
    to,
    module_name,
    severity,
    user_id: kf.userId,
    box_id: kf.boxId,
    session_key: localStorage.session_key,
  };

  const success = (data) => {
    if (data.result === 'success') {
      localStorage.session_key = data.session_key;
      if (DEBUG) {
        console.log('successfully loaded log, decrypting');
        console.log(data);
      }
      const decrypt = decryptLog(kf, data);
      updateLog(decrypt);
    }
  };

  const fail = () => {
    console.error('network error while getting history');
  };

  postData(request, success, fail);
}

export default loadLog;
