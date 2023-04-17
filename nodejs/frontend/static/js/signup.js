const submit = document.getElementById("submit-btn");
const inputUser = document.getElementById("input-user");
const inputEmail = document.getElementById("input-email");
const inputPassword = document.getElementById("input-password");

submit.addEventListener("click", () => {
  let user = inputUser.value;
  let email = inputEmail.value;
  let password = inputPassword.value;

  let data = JSON.stringify({ user: user, email: email, pass: password });

  document.cookie =
    "userMemory=" +
    data +
    "; expires=" +
    new Date(new Date().getTime() + 1.5 * 1000).toUTCString() +
    "; path=/signup";
});

(() => {
  let cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split("=");

    if (cookie[0] === "userMemory") {
      let miCookie = JSON.parse(cookie[1]);

      inputUser.value = miCookie.user;
      inputEmail.value = miCookie.email;
      inputPassword.value = miCookie.pass;
    }
  }
})();
