const btn = document.querySelector('.btn-lg');

btn.addEventListener('click', (e) => {
  e.preventDefault();
  $('.formMessage').hide();
  let fullName = $('#name').val();
  let usermail = $('#email').val();
  let user = $('#username').val();
  let passw = $('#password').val();
  let confirm = $('#confirm').val();
  console.log(fullName,
    usermail,
    user,
    passw)
  if (passw !== confirm ||
    passw.length < 8 ||
    confirm.length < 8) {
    
      let alert = $(`<div class="alert alert-danger" role="alert">
    passwords do not match!
  </div>`);

$(alert).prependTo('.card-body');

  } else if (!(/\S+@\S+\.\S+/.test(usermail))) {
    alert('Please enter a correct email!')


  } else if (fullName.length < 1 ||
    usermail.length < 1 ||
    user.length < 1 ||
    passw.length < 1 ||
    confirm.length < 1) {
    let alert = $(`<div class="alert alert-danger" role="alert">
                     Please fill in all Fields!
                   </div>`);

    $(alert).prependTo('.card-body');

  } else if (fullName && usermail && user && passw && confirm && (passw === confirm) && !user.indexOf(' ') >= 0) {


    fetch(`/register/process`, {
      method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        name: fullName,
        email: usermail,
        username: user,
        password: passw
      })
    }).then(response => response.json()).then(res => {
      console.log(res.message)
      switch (res.message) {
        case 'Registered Successfully! Email has been sent, please Check your Mails':
          let alert = $(`<div class="alert alert-success" role="alert">
              ${res.message}  </div>`);
          $('.card').append(alert);
          break;
        case 'Email already registered! Please Provide a correct Email or click here to login':
        case 'User with given Username already registered! Please Provide a correct Email or click here to login':
          let warning = $(`<div class="alert alert-warning alert-redirect formMessage" role="alert">
              <a href="/">${res.message}</a></div>`);
          $('.card').append(warning);
          break;
      }
    });
  } else if(str.indexOf(' ') >= 0){
    let alert = $(`<div class="alert alert-danger" role="alert">
    username must not have white spaces!
  </div>`);

$(alert).prependTo('.card-body');
  }

})

$('input').on('click', () => {
  $('.formMessage').hide();
})
$('input').click(() => $('.alert').remove());
$('button').on('click', () => $('.alert').remove());
$('a').on('click', () => $('.alert').remove());