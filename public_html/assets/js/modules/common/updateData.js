import decryptData from './decryptData';
import updatePage from './updatePage';
import settings from './settings';
import postData from './postData';
import Main from '../main/main';


function updateData() {
  const kf = new KeyFile();

  const authSettings = {
    action: 'get_data',
    user_id: kf.userId,
    box_id: kf.boxId,
    session_key: localStorage.session_key,
  };

  const success = (data) => {
    if (DEBUG) {
      console.log('successfully loaded data, decrypting');
    }
    setTimeout(updateData, settings.data_update_interval);
    const decrypt = decryptData(kf, data);

    if (settings.first_loaded) {
      new Main(decrypt);
      settings.first_loaded = false;
    } else {
      updatePage(decrypt);
    }
  };

  const fail = () => {
    if (DEBUG) {
      console.error('network error');
    }
    setTimeout(updateData, settings.data_update_interval);
  };
  postData(authSettings, success, fail);
}

export default updateData;
