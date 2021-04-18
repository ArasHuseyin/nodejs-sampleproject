const loginhandler = (e) => {
    e.preventDefault();
    $('.alert').remove();
    fetch(`/login`, {
        method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          email: $('.username-input').val(),
          password: $('#password').val()
        })
      })
      .then(res => res.json())
      .then(res => {
          console.log(res)
          if(res.status === true)
          window.location.href = '/dashboard';

          if(res.status === false){
            $(`<div style="margin-top: 10%;" class="alert alert-warning" role="alert">${res.message}</div>`).prependTo('.login-form')
          }
      })
}

$('.login-btn').on('click', loginhandler);
$('form').on('submit', loginhandler);
