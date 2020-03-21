const firebaseConfig = {
  apiKey: "AIzaSyDJe2bMRVJN6ifcX45y2w5-0UX0eQtK7Hs",
  authDomain: "translation-chat-a3770.firebaseapp.com",
  databaseURL: "https://translation-chat-a3770.firebaseio.com",
  projectId: "translation-chat-a3770",
  storageBucket: "translation-chat-a3770.appspot.com",
  messagingSenderId: "7184432177",
  appId: "1:7184432177:web:a3fe5768e949930f"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();