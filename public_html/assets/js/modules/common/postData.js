import settings from './settings';
import authWithRSA from './authWithRSA';
import Login from '../auth/login';
import Registration from '../auth/registration';

function postData(obj, successF, failF) {
  $.ajax({
    type: "POST",
    url: settings.global_serverJSONUrl,
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
        if (settings.print_debug_to_console) {
          console.log("registration needed");
        }
        new Registration();
      } else if (data["result"] === "do_login") {
        var kf = new KeyFile();
        localStorage["session_key"] = data["session_key"];
        if (settings.print_debug_to_console)
          console.log("login requested");
        if (typeof kf.getMyPrivateKey() !== "undefined" && kf.getMyPrivateKey().length === 256) {
          if (settings.print_debug_to_console)
            console.log("trying to login with RSA");
          authWithRSA(kf, data);
        } else {
          if (settings.print_debug_to_console)
            console.log("no private key, SRP auth forced");
          new Login();
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

export default postData;
