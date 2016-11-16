function KeyFile() {

    this.userId = localStorage["userId"];
    this.boxId = localStorage["boxId"];
    //localStorage["userId"] + "." + localStorage["boxId"] = this.userId + "." + this.boxId;
    //if (localStorage["userId"] + "." + localStorage["boxId"] !)
    this.xhr = null;

    this.initKeyFile = function (newUserId, newBoxId, privateKey, publicKey, pbkdf) {
        this.userId = newUserId.toString();
        this.boxId = newBoxId.toString();
        //localStorage["userId"] + "." + localStorage["boxId"] = this.userId + "." + this.boxId;
        localStorage["userId"] = newUserId;
        localStorage["boxId"] = newBoxId;
        localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".keys.my.private"] = privateKey;
        localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".keys.my.public"] = publicKey;
        localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".pbkdf"] = pbkdf;
    }

    this.getKeyFileAsStirng = function () {
        var kf = "";
        var userId = localStorage["userId"];
        var boxId = localStorage["boxId"];
        var id = userId + "." + boxId;
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key !== null && key.toString().substring(0, id.length + 6) === (id + ".keys."))
                kf += key + ":" + localStorage[key] + "\n";

        }
        return kf;
    }

    this.getKeyFileAsEncryptedStirng = function (pbkdf) {
        var mode = slowAES.modeOfOperation.CFB;

        if (localStorage["userId"] + "." + localStorage["boxId"] === null || pbkdf === null) {
            alert("ID or PBKDF not set!");
        } else {
            var kf = this.getKeyFileAsStirng();
            console.log("String kf=" + kf);
            var bytesToEncrypt = cryptoHelpers.convertStringToByteArray(kf);
            var key = cryptoHelpers.toNumbers(pbkdf);
            console.log("Encrypting keyfile, pbkdf=" + pbkdf)
            var cipherBytes = slowAES.encrypt(bytesToEncrypt, mode, key, key);
            var kfCipher = cryptoHelpers.toHex(cipherBytes);
            return kfCipher;
        }
    }
        this.uploadKeyFile = function (url, uploadDone) {

            var pbkdf = localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".pbkdf"];
            var mode = slowAES.modeOfOperation.CFB;

            if (localStorage["userId"] + "." + localStorage["boxId"] == null || pbkdf == null)
                alert("ID or PBKDF not set!");
            else {
                var kf = this.getKeyFileAsStirng();
                console.log("String kf=" + kf);
                var bytesToEncrypt = cryptoHelpers.convertStringToByteArray(kf);
                var key = cryptoHelpers.toNumbers(pbkdf);
                console.log("Encrypting keyfile, pbkdf=" + pbkdf)
                var cipherBytes = slowAES.encrypt(bytesToEncrypt, mode, key, key);
                var kfCipher = cryptoHelpers.toHex(cipherBytes);
                this.xhr = new XMLHttpRequest();
                this.xhr.onreadystatechange = uploadDone;
                this.xhr.open("POST", url, true);
                var paramsObj = {
                    "id": localStorage["userId"] + "." + localStorage["boxId"],
                    "session_key": localStorage["session_key"],
                    "action": "kf_upload",
                    "kfCipher": kfCipher
                }

                this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                this.xhr.send(JSON.stringify(paramsObj));
            }

        }

        this.downloadKeyFile = function (url, pbkdf, downloadDone) {
            localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".pbkdf"] = pbkdf;
            var mode = slowAES.modeOfOperation.CFB;
            var callback = downloadDone;
            if (localStorage["userId"] + "." + localStorage["boxId"] === null || pbkdf === null)
                alert("ID or PBKDF not set!");

            var obj = {
                "session_key": localStorage["session_key"],
                "action": "kf_download"
            }

            $.ajax({
                type: "POST",
                url: url,
                dataType: 'json',
                crossDomain: true,
                async: true,
                data: JSON.stringify(obj),
                success: function (data) {
                    if (data["result"] === "success") {
                        var bytesToDecrypt = cryptoHelpers.toNumbers(data["kfCipher"]);
                        var key = cryptoHelpers.toNumbers(pbkdf);
                        console.log("Decryting keyfile, pbkdf=" + pbkdf)
                        var bytes = slowAES.decrypt(bytesToDecrypt, mode, key, key);
                        kfstr = cryptoHelpers.convertByteArrayToString(bytes);
                        //                    console.log("that.id=" + that.id);
                        var keyId = localStorage["userId"] + "." + localStorage["boxId"];

                        if (kfstr.indexOf(keyId + ".keys.my.public:") >= 0) {
                            console.log("got keyfile! \n" + kfstr);
                            var arr = kfstr.split("\n");
                            for (i = 0; i < arr.length; i++) {
                                var kv = arr[i].split(":");
                                if (kv.length === 2 && kv[0].indexOf(keyId + ".keys") === 0)
                                    localStorage[kv[0]] = kv[1];
                            }
                            callback();
                        } else {
                            alert("Got invalid keyfile: \n" + kfstr);
                            callback();
                        }
                    } else {
                        alert("Error while keyfile download: " + data["message"]);
                    }
                },
                fail: function () {
                    alert("Network error while keyfile download");
                }
            })
        }

        this.getMyPublicKey = function () {
            return localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".keys.my.public"]
        }

        this.getMyPrivateKey = function () {
            return localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".keys.my.private"]
        }

        this.addBoxKey = function (boxId, key) {
            localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".keys.box." + boxId] = key;
            return;
        }

        this.getBoxKey = function (boxId) {
            return localStorage[localStorage["userId"] + "." + localStorage["boxId"] + ".keys.box." + boxId];
        }

        this.clearKeyFile = function () {
            for (i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key != null && key.toString().substring(0, localStorage["userId"] + "." + localStorage["boxId"].length + 6) == localStorage["userId"] + "." + localStorage["boxId"] + ".keys.")
                    localStorage.removeItem(key);

            }
        }

        this.clearLocal = function () {
            for (i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                localStorage.removeItem(key);
            }
        }
    }

