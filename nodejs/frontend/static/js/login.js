const submit = document.getElementById('submit-btn');

submit.addEventListener ('click', () => {
    validateData();
});

async function sendUser(new_user){
    const delay = ms => new Promise(res => setTimeout(res, ms));
    var user_info;

    await fetch('/user/log', {
        method: 'POST',
        body: JSON.stringify(new_user),
        headers: {
            'Content-type': 'application/json',
        }
    })  .then(res => res.json())
        .then(data =>{
            user_info = data;
        });

    if(user_info.flag){
        alert(user_info.message)
    } else {
        await delay(200);
        window.location.href = '/'+ user_info.id;
    }
}

function validateData(){
    let user_input = document.getElementById('input-user').value;
    let password_input = document.getElementById('input-password').value;

    if((user_input.length == 0) || (password_input.length == 0)){
        alert('Por favor, llene todos los campos seleccionados');
    } else{
        let new_user = {
            user: user_input,
            password: password_input
        }

        sendUser(new_user);
    }    
}