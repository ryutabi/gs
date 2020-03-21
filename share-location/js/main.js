const loginForm = document.getElementById('loginForm');
const login = document.getElementById('login');
const loginBtn = document.getElementById('loginBtn');
const loader = document.getElementById('loader');
const logoutBtn = document.getElementById('logoutBtn');

let count = 0;


mapLogin = () => {
  if (!login.value) {
    return;
  }

  name = login.value;
  loginForm.classList.add('hidden');
  loader.classList.remove('hidden');
  authLogin();
}


loginForm.addEventListener('submit', e => {
  e.preventDefault();

  mapLogin();
});


authLogout = () => {
  auth.signOut();
  db.collection('users').doc(`${me}`).delete();
  window.location.reload();
}


window.onbeforeunload = () => {
  authLogout();
}