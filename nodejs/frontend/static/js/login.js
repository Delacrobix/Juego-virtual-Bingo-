const submit = document.getElementById("submit-btn");
const inputUser = document.getElementById("input-user");
const inputPassword = document.getElementById("input-password");

submit.addEventListener("click", () => {
  let user = inputUser.value;
  let password = inputPassword.value;

  let data = JSON.stringify({user: user, pass: password});

  document.cookie =
    "userMemory=" + data + "; expires=" +
    new Date(new Date().getTime() + 1.5 * 1000).toUTCString() +
    "; path=/login";
});

(() => {
  let cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split("=");

    if (cookie[0] === "userMemory") {
      let miCookie = JSON.parse(cookie[1]);

      inputUser.value = miCookie.user;
      inputPassword.value = miCookie.pass;
    }
  }
})();
