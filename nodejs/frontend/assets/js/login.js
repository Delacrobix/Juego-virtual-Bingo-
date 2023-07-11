const submit = document.getElementById('submit-btn');
const inputUser = document.getElementById('input-user');
const inputPassword = document.getElementById('input-password');
const inputInvite = document.getElementById('invite-btn');
const form = document.getElementById('login-form');

submit.addEventListener('click', () => {
  let user = inputUser.value;
  let password = inputPassword.value;

  let data = JSON.stringify({ user: user, pass: password });

  document.cookie =
    'userMemory=' +
    data +
    '; expires=' +
    new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString() +
    '; path=/login';
});

inputInvite.addEventListener('click', () => {
  let user = 'invite';
  let password = 'invite';

  inputUser.value = user;
  inputPassword.value = password;

  let data = JSON.stringify({ user: user, pass: password });

  form.submit();

  document.cookie =
    'userMemory=' +
    data +
    '; expires=' +
    new Date(new Date().getTime() + 30 * 60 * 1000).toUTCString() +
    '; path=/login';
});

(() => {
  let cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split('=');

    if (cookie[0] === 'userMemory') {
      let miCookie = JSON.parse(cookie[1]);

      inputUser.value = miCookie.user;
      inputPassword.value = miCookie.pass;
    }
  }
})();
