function notifyNewSharedPreference() {
  Java.use('android.app.SharedPreferencesImpl$EditorImpl').putString.overload('java.lang.String', 'java.lang.String').implementation = function(k, v) {
    send("sharedprefs:"+k+"="+v)
    return this.putString(k, v);
  }
}


notifyNewSharedPreference()