function url_init(){

    var url = Java.use("java.net.URL");

    url.$init.overload('java.lang.String').implementation = function (var0) {
        if(! var0.startsWith("null")){
            send("url:" + var0 +"" );
        }
        return this.$init(var0);
    };

}

function to_string(){

    const String = Java.use('java.lang.String');
    const StringBuilder = Java.use('java.lang.StringBuilder');

    String.toString.implementation = function(){
        const x  = this.toString()
        if(x.length > 5){
            send("to_string:"+x+"")
        }
        return x
    }

    StringBuilder.toString.implementation = function(){
        const x = this.toString()
        if(x.length > 5){
            send("to_string:"+x)
        }
        return x
    }

}


function dexclass_loader(){
    var DexClassLoader = Java.use("dalvik.system.DexClassLoader");

    DexClassLoader.$init.implementation = function(dexPath,optimizedDirectory,librarySearchPath,parent){
            send("dexclassloader:" + dexPath + "|" + optimizedDirectory + "|" + librarySearchPath + "|" + parent + "")
            this.$init(dexPath,optimizedDirectory,librarySearchPath,parent);
    }
}


function hook_secrets(){
    var secret_key_spec = Java.use("javax.crypto.spec.SecretKeySpec");
    secret_key_spec.$init.overload("[B", "java.lang.String").implementation = function (x, y) {
        send('Key:'+new Uint8Array(x));
        return this.$init(x, y);
    }

    var iv_parameter_spec = Java.use("javax.crypto.spec.IvParameterSpec");
    iv_parameter_spec.$init.overload("[B").implementation = function (x) {
        send('IV:'+new Uint8Array(x));
        return this.$init(x);
    }
}

exports.hook_secrets = hook_secrets
exports.to_string = to_string
exports.dexclass_loader = dexclass_loader
exports.url_init = url_init