const firebaseConfig = {
    apiKey: "AIzaSyCaSO5MUT3hp6x-ncpdBBt57Bgwz_8fjVk",
    authDomain: "delta-reversi.firebaseapp.com",
    databaseURL: "https://delta-reversi.firebaseio.com",
    projectId: "delta-reversi",
    storageBucket: "delta-reversi.appspot.com",
    messagingSenderId: "342662468326",
    appId: "1:342662468326:web:06932b378cba653f"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();