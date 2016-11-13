import decryptData from './decryptData';
import updatePage from '../main/updatePage';
import commonData from './commonData';
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
    setTimeout(updateData, commonData.data_update_interval);
    const decrypt = decryptData(kf, data);

    if (commonData.first_loaded) {
      new Main(decrypt);
      commonData.first_loaded = false;
    } else {
      updatePage(decrypt);
    }
  };

  const fail = () => {
    if (DEBUG) {
      console.error('network error');
    }
    setTimeout(updateData, commonData.data_update_interval);
  };
  postData(authSettings, success, fail);
}

export default updateData;
