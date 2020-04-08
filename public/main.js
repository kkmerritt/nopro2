console.log("connected to main.js as well")

$('.ui.modal').modal({inverted: true}).modal('hide');
var login = document.getElementById('login-btn');


login.addEventListener('click', function(){
  $('.ui.modal').modal({inverted: true}).modal('show');
})
