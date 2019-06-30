function Form(form) {
    var currentForm, formData, user, flag;

    var checkUser = function() {
      var savedUser = JSON.parse(localStorage.getItem('current_user'));

      if(savedUser) {
        alert('User already saved');
        flag = confirm('Continue session ?');

        if(flag) {
          alert('Succses! (user redirect to another page)');
          window.location.replace("https://www.google.com.ua");
        } else {
          formActions();
        }
        
      } else {
        formActions();
      }
    }
    checkUser();


    //init actions
    function formActions() {
      setForm();
      catchSubmit();
    };


    function setForm() {
      if( !document.getElementById(form.id) && document.getElementById(form.id) == null ) {
        throw new Error('Error form id');
      } else {
        currentForm = document.getElementById(form.id);
        console.log('Catch form: ' + currentForm);
      }
    };


    function catchSubmit() {
      currentForm.addEventListener('submit', function (e) {
        e.preventDefault();
         
        packData();
        sendData();
        alert('Succses! (user redirect to another page)');
        window.location.replace("http://stackoverflow.com");
      }, false);  
    };


    function packData() {
      var userName = currentForm.querySelector('input[name="name"]').value;
      var userSurname = currentForm.querySelector('input[name="surname"]').value;
      
      //init obj
      user = {
        name: userName,
        surname: userSurname
      }
      //stringify data
      user = JSON.stringify(user);
    };


    function sendData () {
      localStorage.setItem('current_user', user);

      var localValue = JSON.parse(localStorage.getItem('current_user'));
      console.log('local value is: ' + localValue.name);
    };
} 

//calling
var newForm = new Form({
  id: 'subscribe',
});






