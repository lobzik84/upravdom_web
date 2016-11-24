import decryptData from './decryptData';
import updatePage from '../main/updatePage';
import commonData from './commonData';
import postData from './postData';
import Main from '../main/main';

import updateConnection from '../connection/updateConnection';


function updateData() {
  const kf = new KeyFile();
  $('.panel__svg-update').removeClass('panel__svg-update_hide');

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

  const error = (data) => {
    if (DEBUG) {
      console.log(data);
    }
    if (commonData.first_loaded) {
      new Main();
      commonData.first_loaded = false;
    }
    setTimeout(updateData, commonData.data_update_interval);
    updateConnection(data);
  };

  postData(authSettings, success, fail, error);
}

export default updateData;
