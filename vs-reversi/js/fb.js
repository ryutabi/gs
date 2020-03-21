const firebaseConfig = {
  apiKey: "AIzaSyBXezFZeSnAwB4xtUj6y8e9Ru_myQX0_Ms",
  authDomain: "reversi-fa8aa.firebaseapp.com",
  databaseURL: "https://reversi-fa8aa.firebaseio.com",
  projectId: "reversi-fa8aa",
  storageBucket: "reversi-fa8aa.appspot.com",
  messagingSenderId: "633539042087",
  appId: "1:633539042087:web:b8685fc4657d0c0d"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();