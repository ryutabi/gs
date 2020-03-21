const auth = firebase.auth();
let me;

authLogin = () => {
  auth.signInAnonymously();
}

auth.onAuthStateChanged(user => {
  if (user) {
    me = user.uid;
    // console.log(`${me} ログイン!!`);
    openChat();
    messagesList.scrollTop = messagesList.scrollHeight;
    return;
  }
  me = null;
  // console.log('ログアウト!!');
});


window.onload = () => {
  authLogin();
}
