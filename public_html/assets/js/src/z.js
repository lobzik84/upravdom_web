var global_serverJSONUrl = "http://dev.molnet.ru/hs/json";
var global_rsa_e = "10001";
var global_aes_mode = slowAES.modeOfOperation.CFB; //AES mode of operation for all symmetric encryption, including messages, posts, comments, files, keyfile
var data_update_interval = 10000;
var print_debug_to_console = false;
var first_loaded = true;

$(function () {
    //init
    // $('.home').hide();
    // $('.login').hide();
    // $('.registration').hide();
//hide everything
    updateData(); //try to fetch data
    //

    //button handlers
    $('#update_capture').click(function () {
        updateCapture();
    });

    $('#dev_logout').click(function () {
        if (print_debug_to_console)
            console.log("Logging out...");
        ls.clear();
        // $('.registration').hide();
        $('.home').hide();
        $('.login').show();
    });

    $('#lamp--first-status').click(function () {
        var el = this;
        $('.control__status', el).toggleClass('on');
        if ($('.control__status', el).hasClass('on')) {
            var obj = {"LAMP_1": "true"}
            var success = function () {
                $('.control__status', el).text('Включена');
                $('.control__img img', el).attr('src', 'images/lamp.png');
            }
            sendCommand("user_command", obj, success);
        } else {
            var obj = {"LAMP_1": "false"}
            var success = function () {
                $('.control__status', el).text('Выключена');
                $('.control__img img', el).attr('src', 'images/lamp-off.png');
            }
            sendCommand("user_command", obj, success);
        }
    });


    $('#lamp--second-status').click(function () {
        var el = this;
        $('.control__status', el).toggleClass('on');
        if ($('.control__status', el).hasClass('on')) {
            var obj = {"LAMP_2": "true"}
            var success = function () {
                $('.control__status', el).text('Включена');
                $('.control__img img', el).attr('src', 'images/lamp.png');
            }
            sendCommand("user_command", obj, success);
        } else {
            var obj = {"LAMP_2": "false"}
            var success = function () {
                $('.control__status', el).text('Выключена');
                $('.control__img img', el).attr('src', 'images/lamp-off.png');
            }
            sendCommand("user_command", obj, success);
        }
    });


    $('#socket--status').click(function () {
        var el = this;
        $('.control__status', el).toggleClass('on');
        if ($('.control__status', el).hasClass('on')) {
            var obj = {"SOCKET": "true"}
            var success = function () {
                $('.control__status', el).text('Включена');
                $('.control__img img', el).attr('src', 'images/socket.png');
            }
            sendCommand("user_command", obj, success);

        } else {
            var obj = {"SOCKET": "false"}
            var success = function () {
                $('.control__status', el).text('Выключена');
                $('.control__img img', el).attr('src', 'images/socket-off.png');
            }

            sendCommand("user_command", obj, success);
        }
    });



    $('#mode__master').click(function () {

        var command_data = {"mode": "IDLE"};

        var success = function () {
            $('#mode__master').addClass('change__current');
            $('#mode__security').removeClass('change__current');
            $('#mode__current').text('Хозяин Дома');
        }
        sendCommand("switch_mode", command_data, success);

    });

    $('#mode__security').click(function () {
        var command_data = {"mode": "ARMED"};

        var success = function () {
            $('#mode__security').addClass('change__current');
            $('#mode__master').removeClass('change__current');
            $('#mode__current').text('Охрана');
        }
        sendCommand("switch_mode", command_data, success);

    });

    $('.settings__save').on('touchstart', function () {

        $('.settings__save').css('background', '#4caf50');

    });
    $('.settings__save').on('touchend', function () {
        $('.settings__save').css('background', '#444444');
    });

    $('#settings__save_do').click(function () {
        console.log("Saving settings");
        var settingElementIdPrefix = "settings__value--";
        var settingsObject = {};
        var settings = $('[id^="' + settingElementIdPrefix + '"]');

        settings.each(function (index, setting) {
            var settingName = setting.id.toString();
            settingName = settingName.substring(settingElementIdPrefix.length, settingName.length + settingElementIdPrefix.length);
            console.log(settingName + " - " + setting.innerHTML);
            //var obj = {settingName: setting.innerHTML};
            settingsObject[settingName] = setting.innerHTML;
        }
        );
        var obj = {"settings": settingsObject};

        sendCommand("save_settings", obj, null);

    });

    $('#login_srp').click(function () {
        if (print_debug_to_console)
            console.log("logging in with SRP, handshaking");
        var srp = new SRP();
        var login = $("#login_phone").val();
        srp.I = login;
        srp.p = $("#srp__password").val();
        srp.forward_url = "#";//
        srp.url = global_serverJSONUrl;
        srp.success = function () {
            var scrypt = scrypt_module_factory();
            var scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8($("#login_phone").val() + ":" + $("#srp__password").val()), scrypt.encode_utf8(""), 16384, 8, 1, 32);
            var pbkdf = cryptoHelpers.ua2hex(scryptBytes);
            var ls = localStorage;
            ls["userId"] = srp.userId;
            ls["boxId"] = srp.boxId;
            var kf = new KeyFile();
            kf.downloadKeyFile(global_serverJSONUrl, pbkdf, function () {
                if (print_debug_to_console)
                    console.log("sucessfully logged in with SRP, keyfile downloaded");
                updateData();
            });
        }
        srp.identify();
    });




    $('#register').click(function () {

        var rsa = new RSAKey();
        if (print_debug_to_console)
            console.log("generating RSA...");
        rsa.generate(1024, global_rsa_e); //1024 bits, public exponent = 10001
        if (print_debug_to_console)
            console.log("RSA generated, generating salt");
        var srp = new SRP();
        var login = $("#phone").val();
        srp.I = login;
        srp.p = $("#new__password").val(); //TODO check passwords are similiar

        var salt = srp.generateSalt();
        var verifier = srp.getVerifier();
        var publicKey = rsa.n.toString(16);
        if (print_debug_to_console)
            console.log("Generated s=" + salt + ", v=" + verifier + ", public key=" + publicKey + " for login " + login + ", password " + srp.p);

        var regObj = {
            "action": "register",
            "login": login,
            "salt": salt,
            "verifier": verifier,
            "public_key": publicKey
        }
        var success = function (data) {
            if (data["result"] === "success") {
                var scrypt = scrypt_module_factory();
                var scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8($("#phone").val() + ":" + $("#new__password").val()), scrypt.encode_utf8(""), 16384, 8, 1, 32);
                var pbkdf = cryptoHelpers.ua2hex(scryptBytes);
                var kf = new KeyFile();
                kf.initKeyFile(data["new_user_id"], data["box_id"], rsa.d.toString(16), rsa.n.toString(16), pbkdf);
                kf.addBoxKey(data["box_id"], data["box_public_key"]);
                localStorage["session_key"] = data["session_key"];
                if (print_debug_to_console)
                    console.log("created keyfile: \n" + kf.getKeyFileAsStirng());
                kf.uploadKeyFile(global_serverJSONUrl, function () {
                    if (kf.xhr.readyState === 4 && kf.xhr.status === 200) {
                        alert("Successfully registered! UserId = " + data["new_user_id"]);
                        // $('.registration').hide();
                        $('.home').show();
                        updateData();
                    }
                });

            } else {
                alert("Error while registering: " + data["message"]);
            }
        }
        postData(regObj, success, function () {
            alert("Error while registering");
        });

    });

    function updateData() {
        var kf = new KeyFile();

        var obj = {
            "action": "get_data",
            "user_id": kf.userId,
            "box_id": kf.boxId,
            "session_key": localStorage["session_key"]
        }

        var success = function (data) {


            if (print_debug_to_console) {
                console.log("successfully loaded data, decrypting");
            }
            setTimeout(updateData, data_update_interval);
            decryptData(kf, data);
            // $('.registration').hide();
            // $('.login').hide();
            $('.home').show();
            if (first_loaded) {//обновляем только после загрузки данныч - чтоб не мешать авторизации
                updateCapture();
                loadSettings();
                first_loaded = false;
            }


        };
        var fail = function () {
            console.error("network error");
            setTimeout(updateData, data_update_interval);
        }
        postData(obj, success, fail);

    }


    function loadSettings() {
        var kf = new KeyFile();

        var obj = {
            "action": "get_settings",
            "user_id": kf.userId,
            "box_id": kf.boxId,
            "session_key": localStorage["session_key"]
        }

        var success = function (data) {
            if (data["result"] === "success") {
                localStorage["session_key"] = data["session_key"];
                if (print_debug_to_console) {
                    console.log("successfully loaded settings");
                    console.log(data);
                }
                updateSettings(data["settings"])
            }

        };
        var fail = function () {
            console.error("network error while getting settings");
        }
        postData(obj, success, fail);

    }


    function updatePage(data) {

        try {
            if (print_debug_to_console)
                console.log("updating page");
            var json = JSON.parse(data);
            if (json["mode"] === "ARMED") {
                $('#mode__security').addClass('change__current');
                $('#mode__master').removeClass('change__current');
                $('#mode__current').text('Охрана');
            } else if (json["mode"] === "IDLE") {
                $('#mode__master').addClass('change__current');
                $('#mode__security').removeClass('change__current');
                $('#mode__current').text('Хозяин Дома');
            }
            for (var key in json) {
                try {
                    var val = json[key]["last_value"];
                    var elementKey = "#status__value--" + key;
                    if ($(elementKey) !== "undefined") {
                        if (json[key]["par_type"] === "DOUBLE" || json[key]["par_type"] === "INTEGER") {
                            $(elementKey).text(val);
                        } else if (json[key]["par_type"] === "BOOLEAN") {
                            if (val.toString().toLowerCase() === "true") {
                                $(elementKey).addClass("true");
                            } else {
                                $(elementKey).removeClass("false");
                            }

                        }
                        if (json[key]["state"] === "Alert") {
                            console.log("Alert param " + key);
                        }
                    }
                    if (key === "SOCKET") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                        if (val.toString().toLowerCase() === "true") {
                            var el = $('#socket--status');
                            $('.control__status', el).addClass('on');
                            $('.control__status', el).text('Включена');
                            $('.control__img img', el).attr('src', 'images/socket.png');
                        }
                    } else if (key === "LAMP_1") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                        if (val.toString().toLowerCase() === "true") {
                            var el = $('#lamp--first-status');
                            $('.control__status', el).addClass('on');
                            $('.control__status', el).text('Включена');
                            $('.control__img img', el).attr('src', 'images/lamp.png');
                        }
                    } else if (key === "LAMP_2") { //костыль. зажигает лампочки и розетки, если они включены - нужно при перезагрузке страницы
                        if (val.toString().toLowerCase() === "true") {
                            var el = $('#lamp--second-status');
                            $('.control__status', el).addClass('on');
                            $('.control__status', el).text('Включена');
                            $('.control__img img', el).attr('src', 'images/lamp.png');
                        }
                    }
                } catch (ee) {
                    console.error(ee);
                }

            }

            console.log("page updated");
        } catch (e) {
            console.error(e);
        }
    }

    function updateSettings(data) {

        try {

            var json = data;
            for (var key in json) {
                try {
                    if (print_debug_to_console) {
                        console.log("loading settings " + key);
                    }
                    var val = json[key];
                    var elementKey = "#settings__value--" + key;
                    if ($(elementKey) != "undefined") {

                        $(elementKey).html(val);

                    }
                } catch (ee) {
                    console.error(ee);
                }

            }

            console.log("settings loaded");
        } catch (e) {
            console.error(e);
        }
    }

    function updateCapture() {
        var kf = new KeyFile();

        var obj = {
            "action": "get_capture",
            "user_id": kf.userId,
            "box_id": kf.boxId,
            "session_key": localStorage["session_key"]
        }

        var success = function (data) {
            if (data["result"] === "success") {
                localStorage["session_key"] = data["session_key"];
                if (print_debug_to_console)
                    console.log("successfully loaded capture, decrypting");
                decryptCapture(kf, data);

            }

        }
        var fail = function () {
            console.error("network error while getting capture");
        }

        postData(obj, success, fail);

    }

    function decryptData(kf, data) {
        if (print_debug_to_console)
            console.log("decrypting \n" + JSON.stringify(data));
        var rsa = new RSAKey();
        rsa.setPrivate(kf.getMyPublicKey(), global_rsa_e, kf.getMyPrivateKey());
        var res = rsa.decrypt(data["key_cipher"]);
        if (print_debug_to_console)
            console.log("symmetric key is " + res);
        var key = cryptoHelpers.toNumbers(res); //creating key
        var cipher = data["parameters"];
        var bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //decoding cipher
        var bytes = slowAES.decrypt(bytesToDecrypt, global_aes_mode, key, key); //decrypting message
        var plain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(bytes)); //decoding utf-8
        if (print_debug_to_console)
            console.log("Data decrypted: " + plain);
        //try
        {
            var pk = kf.getBoxKey(kf.boxId);

            var rsa = new RSAKey();
            rsa.setPublic(pk, global_rsa_e);
            var isValid = rsa.verifyString(cipher, data["digest"]); //checking signature with sender's public key
            if (isValid) {
                if (print_debug_to_console)
                    console.log("Valid digest");
                updatePage(plain);
            } else {
                if (print_debug_to_console)
                    console.log("Digest not valid!");
            }

        } /*catch (e) {
         if (print_debug_to_console) console.log("Error checking digest");
         }*/
    }

    function decryptCapture(kf, data) {
        var rsa = new RSAKey();
        rsa.setPrivate(kf.getMyPublicKey(), global_rsa_e, kf.getMyPrivateKey());

        for (var camKey in data) {
            try {
                var camNameStr = camKey.toString();
                var begin = Date.now();
                var extIndex = camNameStr.toLowerCase().indexOf(".jpg");
                if (extIndex < 0)
                    continue;

                if (print_debug_to_console)
                    console.log("decrypting capture " + camNameStr);
                camNameStr = camNameStr.substring(0, extIndex);
                var cam = data[camKey];
                var res = rsa.decrypt(cam["key_cipher"]);
                if (print_debug_to_console)
                    console.log("symmetric key is " + res);
                var key = cryptoHelpers.toNumbers(res); //creating key
                var cipher = cam["img_cipher"];
                var bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //decoding cipher
                var bytes = slowAES.decrypt(bytesToDecrypt, global_aes_mode, key, key); //decrypting

                var imgDate = cam["img_date"];

                var imgElementId = "video_cam_" + camNameStr;
                var imgElement = document.getElementById(imgElementId);
                if (imgElement !== "undefined") {
                    if (print_debug_to_console)
                        console.log("Updating element " + imgElementId + " size: " + bytes.length + " date: " + imgDate);
                    imgElement.src = "data:image/jpeg;base64," + btoa(String.fromCharCode.apply(null, bytes));
                    var captureDate = new Date(imgDate);
                    $("#video--date").html(captureDate.getDay() + "." + captureDate.getMonth() + "." + captureDate.getFullYear() + ",");

                    $("#video--time").html(captureDate.getHours() + ":" + captureDate.getMinutes());
                    if (print_debug_to_console)
                        console.log(camNameStr + " updated, time=" + (Date.now() - begin) + " ms");
                }

            } catch (e) {
                console.error("error decypting capture " + e);
            }
        }
    }

    function authWithRSA(kf, data) {
        var challenge = data["challenge"];
        if (print_debug_to_console)
            console.log("Authenticating with RSA, challenge=" + challenge);
        var rsa = new RSAKey();
        rsa.setPrivate(kf.getMyPublicKey(), global_rsa_e, kf.getMyPrivateKey());
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
                if (print_debug_to_console) {
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

    function sendCommand(name, command_data, successF) {
        var kf = new KeyFile();
        var commandPlain = JSON.stringify(command_data);
        var rsa = new RSAKey();
        rsa.setPrivate(kf.getMyPublicKey(), global_rsa_e, kf.getMyPrivateKey());
        var digest = rsa.signString(commandPlain, "sha256");//generating signature with author's private key
        var publicKey = kf.getBoxKey(kf.boxId);
        rsa = new RSAKey();
        var rng = new SecureRandom();
        var aeskey = (new BigInteger(128, 1, rng)).toString(16);
        rsa.setPublic(publicKey, global_rsa_e);
        var keycipher = rsa.encrypt(aeskey);
        //console.log(aeskey + "," + aeskey.length);
        var bytesToEncrypt = cryptoHelpers.convertStringToByteArray(cryptoHelpers.encode_utf8(commandPlain));//encode to utf8 from unicode, cause aes is sensitive for that, and to byte array
        var key = cryptoHelpers.toNumbers(aeskey);//creating session key
        var cipherBytes = slowAES.encrypt(bytesToEncrypt, global_aes_mode, key, key);//getting message cipher
        var hexEncoded = cryptoHelpers.toHex(cipherBytes)


        var obj = {
            "action": "command",
            "command_name": name,
            "command_data": hexEncoded,
            "digest": digest,
            "key_cipher": keycipher,
            "user_id": kf.userId,
            "box_id": kf.boxId,
            "session_key": localStorage["session_key"]
        }

        postData(obj, successF, null);

    }

    function postData(obj, successF, failF) {
        $.ajax({
            type: "POST",
            url: global_serverJSONUrl,
            dataType: 'json',
            crossDomain: true,
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                if (data["result"] === "success") {
                    if (data["session_key"] !== null && typeof data["session_key"] !== "undefined" && data["session_key"].length > 5) {
                        localStorage["session_key"] = data["session_key"];
                    }
                    if (successF !== null) {
                        successF(data);
                    }
                } else if (data["result"] === "do_register") {
                    if (print_debug_to_console)
                        console.log("registration needed");
                    $('.registration').show();
                } else if (data["result"] === "do_login") {
                    var kf = new KeyFile();
                    localStorage["session_key"] = data["session_key"];
                    if (print_debug_to_console)
                        console.log("login requested");
                    if (typeof kf.getMyPrivateKey() !== "undefined" && kf.getMyPrivateKey().length === 256) {
                        if (print_debug_to_console)
                            console.log("trying to login with RSA");
                        authWithRSA(kf, data);
                    } else {
                        if (print_debug_to_console)
                            console.log("no private key, SRP auth forced");
                        $('.login').show();
                    }
                }
            },
            fail: function () {
                console.error("network error");
                if (failF !== null) {
                    failF();
                }
            }
        })
    }
});
