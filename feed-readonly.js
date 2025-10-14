import {
  getAuth, GoogleAuthProvider, onAuthStateChanged,
  signInWithPopup, signInWithRedirect, getRedirectResult, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc,
  serverTimestamp, query, orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const app = window.firebaseApp;
const db  = window.firebaseDb;
const auth = getAuth(app);

// --- handle redirect return (if popup was blocked previously)
getRedirectResult(auth).then((res) => {
  if (res?.user) console.log('Signed in via redirect:', res.user.uid);
}).catch(err => {
  if (err?.code) console.warn('Redirect result error:', err.code, err.message);
});

const signinBtn = document.getElementById('signin');
const signoutBtn = document.getElementById('signout');
const who = document.getElementById('who');

signinBtn.onclick = async () => {
  try {
    console.log('Trying popup sign-in…');
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (e) {
    console.warn('Popup failed, falling back to redirect:', e.code);
    await signInWithRedirect(auth, new GoogleAuthProvider());
  }
};

signoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, async (user) => {
  console.log('Auth state changed:', !!user, user?.uid);
  if (user) {
    who.textContent = `Signed in as ${user.displayName || user.email}`;
    // show signout, hide signin, show form
    signoutBtn.style.display = 'inline-flex';
    signinBtn.style.display = 'none';
    document.getElementById('post-form').style.display = 'grid';
  } else {
    who.textContent = 'Viewing feed';
    // show signin, hide signout, hide form
    signoutBtn.style.display = 'none';
    signinBtn.style.display = 'inline-flex';
    document.getElementById('post-form').style.display = 'none';
  }
  await loadFeed(user); // keep your existing loadFeed
});
