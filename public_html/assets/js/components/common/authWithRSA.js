import postData from './postData';
import updateData from './updateData';
import commonData from './commonData';
import Login from '../auth/login';

function authWithRSA(kf, data) {
  const challenge = data.challenge;

  if (DEBUG) {
    console.log(`Authenticating with RSA, challenge=${challenge}`);
  }

  const rsa = new RSAKey();

  rsa.setPrivate(kf.getMyPublicKey(), commonData.global_rsa_e, kf.getMyPrivateKey());
  const digest = rsa.signString(challenge, 'sha256'); //  generating signature with author's private key
  const params = {
    action: 'login_rsa',
    user_id: kf.userId,
    box_id: kf.boxId,
    digest,
    session_key: localStorage.session_key,
  };

  const success = () => {
    if (DEBUG) {
      console.log('successfully authenticated with RSA');
    }
    updateData();
  };

  const error = () => {
    console.error(`Error while RSA auth: ${data.message}. Falling back to SRP.`);
    new Login();
  };

  const fail = () => {
    console.error('Error while RSA auth. Falling back to SRP.');
    new Login();
  };
  postData(params, success, fail, error);
}

export default authWithRSA;
