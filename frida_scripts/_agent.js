(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var proxy_hooks = require('./lib/proxy_hooks.js');

var hooks = require('./lib/hooks.js');

var anti_emulator = require('./lib/anti-emulator.js');

Java.perform(function () {
  anti_emulator.bypass_build_properties();
  anti_emulator.bypass_phonenumber();
  anti_emulator.bypass_deviceid();
  anti_emulator.bypass_imsi();
  anti_emulator.bypass_operator_name();
  anti_emulator.bypass_sim_operator_name();
  anti_emulator.bypass_has_file();
  anti_emulator.bypass_processbuilder();
  anti_emulator.bypass_system_properties();
  hooks.to_string();
  hooks.url_init();
  hooks.dexclass_loader();
  hooks.hook_secrets();
  proxy_hooks.bypass_ssl_pinning();
});

},{"./lib/anti-emulator.js":2,"./lib/hooks.js":3,"./lib/proxy_hooks.js":4}],2:[function(require,module,exports){
"use strict";

function replaceFinaleField(object, fieldName, value) {
  var field = object["class"].getDeclaredField(fieldName);
  field.setAccessible(true);
  field.set(null, value);
}

function bypass_build_properties() {
  // Class containing const that we want to modify
  var Build = Java.use("android.os.Build"); // reflection class for changing const

  var Field = Java.use('java.lang.reflect.Field');
  var Class = Java.use('java.lang.Class'); // Replacing Build static fields

  replaceFinaleField(Build, "FINGERPRINT", "abcd/C1505:4.1.1/11.3.A.2.13:user/release-keys");
  replaceFinaleField(Build, "MODEL", "C1505");
  replaceFinaleField(Build, "MANUFACTURER", "Sony");
  replaceFinaleField(Build, "BRAND", "Xperia");
  replaceFinaleField(Build, "BOARD", "7x27");
  replaceFinaleField(Build, "ID", "11.3.A.2.13");
  replaceFinaleField(Build, "SERIAL", "abcdef123");
  replaceFinaleField(Build, "TAGS", "release-keys");
  replaceFinaleField(Build, "USER", "administrator");
}

function bypass_phonenumber() {
  var TelephonyManager = Java.use('android.telephony.TelephonyManager');

  TelephonyManager.getLine1Number.overload().implementation = function () {
    console.log("Phone number bypass");
    return "060102030405";
  };
}

function bypass_deviceid() {
  var TelephonyManager = Java.use('android.telephony.TelephonyManager');

  TelephonyManager.getDeviceId.overload().implementation = function () {
    console.log("Device id");
    return "012343545456445";
  };
}

function bypass_imsi() {
  var TelephonyManager = Java.use('android.telephony.TelephonyManager');

  TelephonyManager.getSubscriberId.overload().implementation = function () {
    console.log("Suscriber ID");
    return "310260000000111";
  };
}

function bypass_operator_name() {
  var TelephonyManager = Java.use('android.telephony.TelephonyManager');

  TelephonyManager.getNetworkOperatorName.overload().implementation = function () {
    console.log("Operator Name");
    return "not";
  };
}

function bypass_sim_operator_name() {
  var TelephonyManager = Java.use('android.telephony.TelephonyManager');

  TelephonyManager.getSimOperatorName.overload().implementation = function () {
    console.log("Operator Name");
    return "not";
  };
}

function bypass_has_file() {
  var File = Java.use("java.io.File");
  var KnownFiles = ["ueventd.android_x86.rc", "x86.prop", "ueventd.ttVM_x86.rc", "init.ttVM_x86.rc", "fstab.ttVM_x86", "fstab.vbox86", "init.vbox86.rc", "ueventd.vbox86.rc", "/dev/socket/qemud", "/dev/qemu_pipe", "/system/lib/libc_malloc_debug_qemu.so", "/sys/qemu_trace", "/system/bin/qemu-props", "/dev/socket/genyd", "/dev/socket/baseband_genyd", "/proc/tty/drivers", "/proc/cpuinfo"];

  File.$init.overload('java.lang.String').implementation = function (x) {
    if (x in KnownFiles) {
      console.log(x);
      return null;
    }

    return this.$init(x);
  };
}

function bypass_processbuilder() {
  var ProcessBuilder = Java.use('java.lang.ProcessBuilder');

  ProcessBuilder.$init.overload('[Ljava.lang.String;').implementation = function (x) {
    console.log("ProcessBuilder");
    return null;
  };
}

function bypass_system_properties() {
  /*
  * Function used to bypass common checks to
  * Android OS properties
  * Bypass the props checking from this git : https://github.com/strazzere/anti-emulator
  *
  */
  var SystemProperties = Java.use('android.os.SystemProperties');
  var String = Java.use('java.lang.String');
  var Properties = {
    "init.svc.qemud": null,
    "init.svc.qemu-props": null,
    "qemu.hw.mainkeys": null,
    "qemu.sf.fake_camera": null,
    "qemu.sf.lcd_density": null,
    "ro.bootloader": "xxxxx",
    "ro.bootmode": "xxxxxx",
    "ro.hardware": "xxxxxx",
    "ro.kernel.android.qemud": null,
    "ro.kernel.qemu.gles": null,
    "ro.kernel.qemu": "xxxxxx",
    "ro.product.device": "xxxxx",
    "ro.product.model": "xxxxxx",
    "ro.product.name": "xxxxxx",
    "ro.serialno": null
  };

  SystemProperties.get.overload('java.lang.String').implementation = function (x) {
    console.log("Property " + x);

    if (x in Properties) {
      console.log('Returning ' + Properties[x]);
      return Properties[x];
    }

    return this.get(x);
  };
}

exports.bypass_build_properties = bypass_build_properties;
exports.bypass_phonenumber = bypass_phonenumber;
exports.bypass_deviceid = bypass_deviceid;
exports.bypass_imsi = bypass_imsi;
exports.bypass_operator_name = bypass_operator_name;
exports.bypass_sim_operator_name = bypass_sim_operator_name;
exports.bypass_has_file = bypass_has_file;
exports.bypass_processbuilder = bypass_processbuilder;
exports.bypass_system_properties = bypass_build_properties;

},{}],3:[function(require,module,exports){
"use strict";

function url_init() {
  var url = Java.use("java.net.URL");

  url.$init.overload('java.lang.String').implementation = function (var0) {
    if (!var0.startsWith("null")) {
      send("url:" + var0 + "");
    }

    return this.$init(var0);
  };
}

function to_string() {
  var String = Java.use('java.lang.String');

  String.toString.implementation = function () {
    var x = this.toString();

    if (x.length > 5) {
      send("to_string:" + x + "");
    }

    return x;
  };
}

function dexclass_loader() {
  var DexClassLoader = Java.use("dalvik.system.DexClassLoader");

  DexClassLoader.$init.implementation = function (dexPath, optimizedDirectory, librarySearchPath, parent) {
    send("dexclassloader:" + dexPath + "|" + optimizedDirectory + "|" + librarySearchPath + "|" + parent + "");
    this.$init(dexPath, optimizedDirectory, librarySearchPath, parent);
  };
}

function hook_secrets() {
  var secret_key_spec = Java.use("javax.crypto.spec.SecretKeySpec");

  secret_key_spec.$init.overload("[B", "java.lang.String").implementation = function (x, y) {
    send('Key:' + new Uint8Array(x));
    return this.$init(x, y);
  };

  var iv_parameter_spec = Java.use("javax.crypto.spec.IvParameterSpec");

  iv_parameter_spec.$init.overload("[B").implementation = function (x) {
    send('IV:' + new Uint8Array(x));
    return this.$init(x);
  };
}

exports.hook_secrets = hook_secrets;
exports.to_string = to_string;
exports.dexclass_loader = dexclass_loader;
exports.url_init = url_init;

},{}],4:[function(require,module,exports){
"use strict";

function bypass_ssl_pinning() {
  var array_list = Java.use("java.util.ArrayList");
  var ApiClient = Java.use('com.android.org.conscrypt.TrustManagerImpl');

  ApiClient.checkTrustedRecursive.implementation = function (a1, a2, a3, a4, a5, a6) {
    var k = array_list.$new();
    return k;
  };
}

exports.bypass_ssl_pinning = bypass_ssl_pinning;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2ZyaWRhLWNvbXBpbGUvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImZyaWRhX3NjcmlwdHMvYWdlbnQuanMiLCJmcmlkYV9zY3JpcHRzL2xpYi9hbnRpLWVtdWxhdG9yLmpzIiwiZnJpZGFfc2NyaXB0cy9saWIvaG9va3MuanMiLCJmcmlkYV9zY3JpcHRzL2xpYi9wcm94eV9ob29rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFELENBQTNCOztBQUNBLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUFyQjs7QUFDQSxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsd0JBQUQsQ0FBN0I7O0FBQ0EsSUFBSSxDQUFDLE9BQUwsQ0FBYSxZQUFVO0FBQ3RCLEVBQUEsYUFBYSxDQUFDLHVCQUFkO0FBQ0EsRUFBQSxhQUFhLENBQUMsa0JBQWQ7QUFDQSxFQUFBLGFBQWEsQ0FBQyxlQUFkO0FBQ0EsRUFBQSxhQUFhLENBQUMsV0FBZDtBQUNBLEVBQUEsYUFBYSxDQUFDLG9CQUFkO0FBQ0EsRUFBQSxhQUFhLENBQUMsd0JBQWQ7QUFDQSxFQUFBLGFBQWEsQ0FBQyxlQUFkO0FBQ0EsRUFBQSxhQUFhLENBQUMscUJBQWQ7QUFDQSxFQUFBLGFBQWEsQ0FBQyx3QkFBZDtBQUNBLEVBQUEsS0FBSyxDQUFDLFNBQU47QUFDQSxFQUFBLEtBQUssQ0FBQyxRQUFOO0FBQ0EsRUFBQSxLQUFLLENBQUMsZUFBTjtBQUNBLEVBQUEsS0FBSyxDQUFDLFlBQU47QUFDQSxFQUFBLFdBQVcsQ0FBQyxrQkFBWjtBQUNBLENBZkQ7Ozs7O0FDSEEsU0FBUyxrQkFBVCxDQUE0QixNQUE1QixFQUFvQyxTQUFwQyxFQUErQyxLQUEvQyxFQUFxRDtBQUNqRCxNQUFJLEtBQUssR0FBSSxNQUFNLFNBQU4sQ0FB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ekYsR0FBa0csRUFBbkcsQ0FBSjtBQUNBLFNBQUssS0FBTCxDQUFXLE9BQVgsRUFBbUIsa0JBQW5CLEVBQXNDLGlCQUF0QyxFQUF3RCxNQUF4RDtBQUNQLEdBSEQ7QUFJSDs7QUFHRCxTQUFTLFlBQVQsR0FBdUI7QUFDbkIsTUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxpQ0FBVCxDQUF0Qjs7QUFDQSxFQUFBLGVBQWUsQ0FBQyxLQUFoQixDQUFzQixRQUF0QixDQUErQixJQUEvQixFQUFxQyxrQkFBckMsRUFBeUQsY0FBekQsR0FBMEUsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUN0RixJQUFBLElBQUksQ0FBQyxTQUFPLElBQUksVUFBSixDQUFlLENBQWYsQ0FBUixDQUFKO0FBQ0EsV0FBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFQO0FBQ0gsR0FIRDs7QUFLQSxNQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsbUNBQVQsQ0FBeEI7O0FBQ0EsRUFBQSxpQkFBaUIsQ0FBQyxLQUFsQixDQUF3QixRQUF4QixDQUFpQyxJQUFqQyxFQUF1QyxjQUF2QyxHQUF3RCxVQUFVLENBQVYsRUFBYTtBQUNqRSxJQUFBLElBQUksQ0FBQyxRQUFNLElBQUksVUFBSixDQUFlLENBQWYsQ0FBUCxDQUFKO0FBQ0EsV0FBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDSCxHQUhEO0FBSUg7O0FBRUQsT0FBTyxDQUFDLFlBQVIsR0FBdUIsWUFBdkI7QUFDQSxPQUFPLENBQUMsU0FBUixHQUFvQixTQUFwQjtBQUNBLE9BQU8sQ0FBQyxlQUFSLEdBQTBCLGVBQTFCO0FBQ0EsT0FBTyxDQUFDLFFBQVIsR0FBbUIsUUFBbkI7Ozs7O0FDcERBLFNBQVMsa0JBQVQsR0FBNkI7QUFDekIsTUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxxQkFBVCxDQUFqQjtBQUNBLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsNENBQVQsQ0FBaEI7O0FBRUEsRUFBQSxTQUFTLENBQUMscUJBQVYsQ0FBZ0MsY0FBaEMsR0FBaUQsVUFBUyxFQUFULEVBQVksRUFBWixFQUFlLEVBQWYsRUFBa0IsRUFBbEIsRUFBcUIsRUFBckIsRUFBd0IsRUFBeEIsRUFBNEI7QUFDckUsUUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQVgsRUFBUjtBQUNBLFdBQU8sQ0FBUDtBQUNQLEdBSEQ7QUFJSDs7QUFFRCxPQUFPLENBQUMsa0JBQVIsR0FBNkIsa0JBQTdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIifQ==
