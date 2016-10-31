import postData from './postData';
import decryptData from './decryptData';
import settings from './settings';
import Main from '../main/main';

function updateData() {
  var kf = new KeyFile();

  var obj = {
    "action": "get_data",
    "user_id": kf.userId,
    "box_id": kf.boxId,
    "session_key": localStorage["session_key"]
  }

  var success = function (data) {
    if (settings.print_debug_to_console) {
      console.log("successfully loaded data, decrypting");
    }
    setTimeout(updateData, settings.data_update_interval);
    decryptData(kf, data);
    new Main();
  };
  var fail = function () {
    console.error("network error");
    setTimeout(updateData, settings.data_update_interval);
  }
  postData(obj, success, fail);

}

export default updateData;
