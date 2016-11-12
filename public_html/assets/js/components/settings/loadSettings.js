import postData from '../common/postData';
import updateSettings from './updateSettings';

function loadSettings() {
  const kf = new KeyFile();

  const authSettings = {
    action: 'get_settings',
    user_id: kf.userId,
    box_id: kf.boxId,
    session_key: localStorage.session_key,
  };

  const success = (data) => {
    if (data.result === 'success') {
      localStorage.session_key = data.session_key;
      if (DEBUG) {
        console.log('successfully loaded settings');
        console.log(data);
      }
      updateSettings(data.settings);
    }
  };
  const fail = () => {
    console.error('network error while getting settings');
  };
  postData(authSettings, success, fail);
}

export default loadSettings;
