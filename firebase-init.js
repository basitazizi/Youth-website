// firebase-init.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBd7IJc0K0jqKaNfZBBKF_V5bjY-WCK8oI",
  authDomain: "youth-website-1d7b0.firebaseapp.com",
  projectId: "youth-website-1d7b0",
  storageBucket: "youth-website-1d7b0.appspot.com",
  messagingSenderId: "109544540041",
  appId: "1:109544540041:web:52715b2ca691b6de998358",
  measurementId: "G-WSLJ23FKLT"
};

const app = initializeApp(firebaseConfig);
window.firebaseApp = app;                 // <-- expose
window.firebaseDb  = getFirestore(app);   // <-- expose
