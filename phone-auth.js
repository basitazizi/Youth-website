import { getAuth, RecaptchaVerifier, signInWithPhoneNumber }
    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const auth = getAuth(window.firebaseApp);
let confirmation;

// 1) Render reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
    callback: (r) => console.log('reCAPTCHA solved:', r)
});

// 2) Send SMS
document.getElementById('send-code').onclick = async () => {
    const phone = document.getElementById('phone-number').value.trim();
    const appVerifier = window.recaptchaVerifier;
    document.getElementById('status').textContent = 'Sending code…';
    try {
        confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
        document.getElementById('status').textContent = 'Code sent! Check your SMS.';
    } catch (e) {
        console.error(e); document.getElementById('status').textContent = e.message;
    }
};

// 3) Verify code and sign in
document.getElementById('verify-btn').onclick = async () => {
    const code = document.getElementById('verify-code').value.trim();
    try {
        const result = await confirmation.confirm(code);
        const user = result.user;
        document.getElementById('status').textContent =
            `Signed in as ${user.phoneNumber}`;
        console.log('Phone Auth success:', user.uid);
    } catch (e) {
        console.error(e); document.getElementById('status').textContent = e.message;
    }
};
