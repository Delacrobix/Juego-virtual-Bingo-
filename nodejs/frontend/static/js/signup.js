const submit = document.getElementById('submit-btn');

submit.addEventListener ('click', () => {
    validateData();
})

async function sendData(user){
    let new_user;

    await fetch('/addUser', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json',
        }
    }).then(res => res.json())
      .then(data => {
        new_user = data;
      });

    if(new_user.flag){
        alert(new_user.message);
    } else {
        alert("Usuario registrado exitosamente.");
        window.location.href = '/login';
    }
}

function validateData(){
    let user_input = document.getElementById('input-user').value;
    let password_input = document.getElementById('input-password').value;
    let email_input = document.getElementById('input-email').value;

    if((user_input.length == 0) || (password_input.length == 0) || (email_input.length == 0)){
        alert('Por favor, llene todos los campos seleccionados');
    } else{
        let new_user = {
            user: user_input,
            email: email_input,
            password: password_input
        }
    
        sendData(new_user);
    }
}