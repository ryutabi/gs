const auth = firebase.auth();
let me;
let name;

authLogin = () => {
  auth.signInAnonymously();
}

auth.onAuthStateChanged(user => {
  if (user) {
    me = user.uid;
    if (!name) {
      name = me.substr(0, 5);
    }
    console.log(`${me} ログイン!!`);
    loginForm.classList.add('hidden');
    loader.classList.remove('hidden');

    GetMap = () => {
      navigator.geolocation.getCurrentPosition(mapInit, mapError, options);
    }

    return;
  }
  me = null;
  console.log('ログアウト!!');
});