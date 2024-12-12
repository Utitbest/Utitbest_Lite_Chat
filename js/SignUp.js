
import FirebaseService from './FireBaseConfig.js';



const firebaseConfig = {
    apiKey: "AIzaSyB6tpiYpOYmh9z2LCzWClPhC4IJCWgBaMc",
    authDomain: "utitbest-realchat.firebaseapp.com",
    projectId: "utitbest-realchat",
    storageBucket: "utitbest-realchat.appspot.com",
    messagingSenderId: "904249328831",
    appId: "1:904249328831:web:d60acbc92f7db54f0bb20a"
};


const firebaseService = new FirebaseService(firebaseConfig);

function timeOut() {
    let Firstname = document.querySelector('.Firstname')
    let Lastname = document.querySelector('.Lastname')
    let Email = document.querySelector('.Email')
    let password = document.querySelector('.password')
    let Conpassword = document.querySelector('.Conpassword')
    let vibes1 = document.querySelectorAll('.fff')
    let errorMsg = document.querySelector('.errorIN')
    let Botton = document.getElementById('Botton')

      Botton.addEventListener('click', async function(){
        if(Firstname.value == ''&& Lastname.value == ''&& Email.value == ''&& password.value == ''&& Conpassword.value == ''){
          vibes1[0].style.borderColor = 'red';
          vibes1[1].style.borderColor = 'red';
          vibes1[2].style.borderColor = 'red';
          vibes1[3].style.borderColor = 'red';
          vibes1[4].style.borderColor = 'red';
          errorMsg.innerHTML = 'Please fill the inputs'
          return 
      }
      if(Firstname.value == ''){
          vibes1[0].style.borderColor = 'red';
          Firstname.focus()
          errorMsg.innerHTML = 'Invalid name';
          return 
      }
      if(Firstname.value.length  < 3){
          vibes1[0].style.borderColor = 'red';
          Firstname.focus()
          errorMsg.innerHTML = 'Name to short';
          return 
      }
      if(Firstname.value.search(/[^a-z ]/i) !== -1){
          vibes1[0].style.borderColor = 'red';
          Firstname.focus()
          errorMsg.innerHTML = 'Name must be alphabetic';
          return 
      }
      if(Lastname.value == ''){
          vibes1[1].style.borderColor = 'red';
          Lastname.focus()
          errorMsg.innerHTML = 'Invalid name';
          return 
      }
      if(Lastname.value.length  < 3){
          vibes1[1].style.borderColor = 'red';
          Lastname.focus()
          errorMsg.innerHTML = 'Name to short';
          return 
      }
      if(Lastname.value.search(/[^a-z ]/i) !== -1){
          vibes1[1].style.borderColor = 'red';
          Lastname.focus()
          errorMsg.innerHTML = 'Name must be alphabetic';
          return 
      }
      // let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(Email.value == ''){
          vibes1[2].style.borderColor = 'red';
          Email.focus()
          errorMsg.innerHTML = 'Invalid email address';
          return 
      }
      if(!Email.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
          vibes1[2].style.borderColor = 'red';
          Email.focus()
          errorMsg.innerHTML = 'Not a valid email address';
          return 
      }
      if(password.value == ''){
          vibes1[3].style.borderColor = 'red';
          password.focus()
          errorMsg.innerHTML = 'Type your password';
          return 
      }
      if(password.value.length < 5){
          vibes1[3].style.borderColor = 'red';
          password.focus()
          errorMsg.innerHTML = 'Password must be at least 5 characters min ';
          return 
      }
      if(password.value.length > 11){
          vibes1[3].style.borderColor = 'red';
          password.focus()
          errorMsg.innerHTML = 'Maximum password require is 11 characters';
          return 
      }
      if(Conpassword.value == ''){
          vibes1[4].style.borderColor = 'red';
          Conpassword.focus()
          errorMsg.innerHTML = 'Confirm your password';
          return 
      }
      if(Conpassword.value !== password.value){
          vibes1[4].style.borderColor = 'red';
          Conpassword.focus()
          errorMsg.innerHTML = 'Password not march!';
          return 
      }

        let credentials = { email: Email.value, password: password.value };
        let userData = { firstname: Firstname.value, lastname: Lastname.value, email: Email.value, password: password.value };

        try{
          const userId =  await firebaseService.registerUser(credentials, userData)

          const userInfo = await firebaseService.getUserData(userId);
          
          if(userInfo) {
            console.error("User info is null or undefined");
          }

     
          window.location.href = './UtitbestChatInterface.html';
        }catch (error) {
          console.error("Error during registration:", error);
            //   alert("There was an issue with registration. Please try again.")
        }
      
      Firstname.value = '';
      Lastname.value = '';
      Email.value = '';
      password.value = '';
      Conpassword.value = '';
      vibes1[0].style.borderColor = '';
      vibes1[1].style.borderColor = '';
      vibes1[2].style.borderColor = '';
      vibes1[3].style.borderColor = '';
      vibes1[4].style.borderColor = '';
      errorMsg.innerHTML = '';
      })
    }
function IfInputIsnull(){
let tinput = document.querySelectorAll('input');
let vibes1 = document.querySelectorAll('.fff')
tinput.forEach((input, i) => {
    input.addEventListener('input', function(){
        vibes1[i].style.borderColor = 'gray';
    })
})
}
function RevealPassword(){
var eyesplash = document.querySelectorAll('.spack')
    eyesplash.forEach((egg, ii) =>{
        let inputs = document.querySelectorAll('.peace')
        egg.addEventListener('click',  function(){
            if(inputs[ii].type == 'password'){
                inputs[ii].type = 'text'
                egg.innerHTML = '<i class="fa fa-eye vv"></i>';
            }else{
                inputs[ii].type = 'password'
                egg.innerHTML = '<i class="fa fa-eye-slash vv"></i>';
            }
            // alert('hello')
        })
    })  
}
timeOut()
RevealPassword()
IfInputIsnull()
