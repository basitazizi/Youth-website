// must run before feed.js and use type="module"
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {getFirestore} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const app = initializeApp({ /* your config */});
window.firebaseApp = app;
window.firebaseDb = getFirestore(app);
<script type="module" src="firebase-init.js"></script>
<script type="module" src="phone-auth.js"></script>
