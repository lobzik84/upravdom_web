import updatePage from './updatePage';
import settings from './settings';


function decryptData(kf, data) {
    if (settings.print_debug_to_console)
        console.log("decrypting \n" + JSON.stringify(data));
    var rsa = new RSAKey();
    rsa.setPrivate(kf.getMyPublicKey(), settings.global_rsa_e, kf.getMyPrivateKey());
    var res = rsa.decrypt(data["key_cipher"]);
    if (settings.print_debug_to_console)
        console.log("symmetric key is " + res);
    var key = cryptoHelpers.toNumbers(res); //creating key
    var cipher = data["parameters"];
    var bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //decoding cipher
    var bytes = slowAES.decrypt(bytesToDecrypt, settings.global_aes_mode, key, key); //decrypting message
    var plain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(bytes)); //decoding utf-8
    if (settings.print_debug_to_console)
        console.log("Data decrypted: " + plain);
    //try
    {
        var pk = kf.getBoxKey(kf.boxId);

        var rsa = new RSAKey();
        rsa.setPublic(pk, settings.global_rsa_e);
        var isValid = rsa.verifyString(cipher, data["digest"]); //checking signature with sender's public key
        if (isValid) {
            if (settings.print_debug_to_console)
                console.log("Valid digest");
            updatePage(plain);
        } else {
            if (settings.print_debug_to_console)
                console.log("Digest not valid!");
        }

    } /*catch (e) {
     if (settings.print_debug_to_console) console.log("Error checking digest");
     }*/
}

export default decryptData;
