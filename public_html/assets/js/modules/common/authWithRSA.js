import postData from './postData';
import updateData from './updateData';
import settings from './settings';


function authWithRSA(kf, data) {
    var challenge = data["challenge"];
    if (settings.print_debug_to_console)
        console.log("Authenticating with RSA, challenge=" + challenge);
    var rsa = new RSAKey();
    rsa.setPrivate(kf.getMyPublicKey(), settings.global_rsa_e, kf.getMyPrivateKey());
    var digest = rsa.signString(challenge, "sha256");//generating signature with author's private key
    var obj = {
        "action": "login_rsa",
        "user_id": kf.userId,
        "box_id": kf.boxId,
        "digest": digest,
        "session_key": localStorage["session_key"]
    }
    var success = function (data) {
        if (data["result"] === "success") {
            if (settings.print_debug_to_console) {
                console.log("successfully authenticated with RSA");
            }
            updateData();
        } else {
            console.error("Error while RSA auth: " + data["message"] + ". Falling back to SRP.");
            $('.login').show();
        }
    }
    var fail = function () {
        console.error("Error while RSA auth. Falling back to SRP.");
        $('.login').show();
    }
    postData(obj, success, fail);
}

export default authWithRSA;
