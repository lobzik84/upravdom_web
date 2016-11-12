import settings from './settings';
import authWithRSA from './authWithRSA';
import Login from '../auth/login';
import Registration from '../auth/registration';

const postData = (obj, successF, failF, errorF) => {
    $.ajax({
        type: 'POST',
        url: settings.global_serverJSONUrl,
        dataType: 'json',
        crossDomain: true,
        async: true,
        data: JSON.stringify(obj),
        success(data) {
            if (data.result === 'success') {
                if (data.session_key !== null && typeof data.session_key !== 'undefined' && data.session_key.length > 5) {
                    localStorage.session_key = data.session_key;
                }
                if (successF !== null) {
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
                if (errorF !== null && typeof errorF === 'function') {
                    errorF(data);
                }
            }
        },
        fail() {
            console.error('network error');
            if (failF !== null && typeof failF === 'function') {
                failF();
            }
        },
    });
};

export default postData;
