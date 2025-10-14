// feed.js — Full CRUD with Auth + admin override
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged,
  signInWithPopup, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc,
  serverTimestamp, query, orderBy
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const app = window.firebaseApp;
const db  = window.firebaseDb;
const auth = getAuth(app);

// UI elements
const postsGrid = document.getElementById('posts');
const form = document.getElementById('post-form');
const signinBtn = document.getElementById('signin');
const signoutBtn = document.getElementById('signout');
const who = document.getElementById('who');

// Check admin via /admins/{uid} { isAdmin: true }
async function isAdmin(uid){
  if(!uid) return false;
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    return snap.exists() && snap.data().isAdmin === true;
  } catch {
    return false;
  }
}

function cardTemplate(id, data, canEdit){
  const when = data.createdAt?.toDate?.() || new Date();
  const wrap = document.createElement('div');
  wrap.className = 'card reveal';
  wrap.dataset.id = id;
  wrap.innerHTML = `
    <span class="tag">${when.toLocaleString()}</span>
    <h3>${escapeHtml(data.title || 'Untitled')}</h3>
    <p style="color:#eaeaea">${escapeHtml(data.content || '')}</p>
    <p style="color:#ffd34e;font-weight:700;margin-top:8px">— ${escapeHtml(data.author || 'Anonymous')}</p>
    <div class="btn-row" style="margin-top:12px; ${canEdit ? '' : 'display:none'}">
      <button class="btn" data-edit>Edit</button>
      <button class="btn" data-delete>Delete</button>
    </div>`;
  return wrap;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

async function loadFeed(user){
  postsGrid.innerHTML = '';
  const admin = await isAdmin(user?.uid);
  const q = query(collection(db, 'feed'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const items = [];
  snap.forEach(d => items.push({ id: d.id, ...d.data() }));
  items.forEach(post => {
    const mine = user && post.authorUid === user.uid;
    const canEdit = mine || admin;
    postsGrid.appendChild(cardTemplate(post.id, post, canEdit));
  });
  document.dispatchEvent(new Event('scroll')); // trigger reveal animations
}

// Auth bar
signinBtn.onclick = () => signInWithPopup(auth, new GoogleAuthProvider());
signoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, async (user) => {
  if(user){
    who.textContent = `Signed in as ${user.displayName || user.email}`;
    signinBtn.style.display = 'inline-flex';
    signoutBtn.style.display = 'inline-flex';
    signinBtn.style.display = 'none';
    form.style.display = 'grid';
  }else{
    who.textContent = 'Viewing feed';
    signinBtn.style.display = 'inline-flex';
    signoutBtn.style.display = 'none';
    form.style.display = 'none';
  }
  await loadFeed(user);
});

// Create post
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const user = auth.currentUser;
  if(!user) return alert('Please sign in first.');
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  if(!data.title || !data.content || !data.author){
    return alert('Please fill out all fields.');
  }
  await addDoc(collection(db,'feed'), {
    title: data.title,
    content: data.content,
    author: data.author,
    authorUid: user.uid,
    createdAt: serverTimestamp()
  });
  form.reset();
  await loadFeed(user);
});

// Edit / Delete
postsGrid.addEventListener('click', async (e)=>{
  const card = e.target.closest('.card'); if(!card) return;
  const id = card.dataset.id;

  if(e.target.matches('[data-delete]')){
    if(confirm('Delete this post?')){
      await deleteDoc(doc(db,'feed', id));
      await loadFeed(auth.currentUser);
    }
  }

  if(e.target.matches('[data-edit]')){
    const currTitle = card.querySelector('h3').textContent.trim();
    const currContent = card.querySelector('p').textContent.trim();
    const title = prompt('New title:', currTitle);
    const content = prompt('New content:', currContent);
    if(title!==null && content!==null){
      await updateDoc(doc(db,'feed', id), { title, content });
      await loadFeed(auth.currentUser);
    }
  }
});
