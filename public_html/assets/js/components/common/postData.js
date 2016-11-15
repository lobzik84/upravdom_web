import commonData from './commonData';
import authWithRSA from './authWithRSA';

import Login from '../auth/login';
import Registration from '../auth/registration';

import updateConnection from '../connection/updateConnection';

const postData = (obj, successF, failF, errorF) => {
  $.ajax({
    type: 'POST',
    url: commonData.global_serverJSONUrl,
    dataType: 'json',
    crossDomain: true,
    async: true,
    data: JSON.stringify(obj),
    success(data) {
      if (data.result === 'success') {
        if (data.session_key !== null && typeof data.session_key !== 'undefined' && data.session_key.length > 5) {
          localStorage.session_key = data.session_key;
        }
        const connect = {
          connection_type: data.connection_type,
          box_link: data.box_link,
          server_link: data.server_link
        };
        updateConnection(connect);

        if (typeof data.connection_type !== 'undefined' && data.connection_type !== commonData.connection_type) {
          commonData.connection_type = data.connection_type;
        }
        if (successF !== null && typeof successF === 'function') {
          successF(data);
        }
      } else if (data.result === 'do_register') {
        if (DEBUG) {
          console.log('registration needed');
        }
        new Registration();
      } else if (data.result === 'do_login') {
        const kf = new KeyFile();
        localStorage.session_key = data.session_key;
        if (DEBUG) {
          console.log('login requested');
        }
        if (typeof kf.getMyPrivateKey() !== 'undefined' && kf.getMyPrivateKey().length === 256) {
          if (DEBUG) {
            console.log('trying to login with RSA');
          }
          authWithRSA(kf, data);
        } else {
          if (DEBUG) {
            console.log('no private key, SRP auth forced');
          }
          new Login();
        }
      } else if (data.result === 'error') {
        if (DEBUG) {
          console.error(`got error from box: ${data.message}`);
        }
        if (errorF !== null && typeof errorF === 'function') {
          errorF(data);
        }
      }
    },
    error() {
      if (DEBUG) {
        console.error('network error');
      }

      updateConnection(false);

      if (failF !== null && typeof failF === 'function') {
        failF();
      }
    },
  });
};

export default postData;
