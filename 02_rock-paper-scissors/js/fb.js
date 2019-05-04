const config = {
  apiKey: "AIzaSyA_loyydzN9pdNOkbB_YYkNxPbw0XCzFI0",
  authDomain: "janken-ca178.firebaseapp.com",
  databaseURL: "https://janken-ca178.firebaseio.com",
  projectId: "janken-ca178",
  storageBucket: "janken-ca178.appspot.com",
  messagingSenderId: "260546979836"
};
firebase.initializeApp(config);

const db = firebase.firestore();