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

function Validation(){
        var ErroMsg = document.querySelector('.errorIN')
        var diss = document.querySelectorAll('.bbb')
        var Email = document.querySelector('.Email')
        var password = document.querySelector('.password')
        var checkboo = document.querySelector('#eiie')
        var codere = document.querySelector('.codere p')
        var Button = document.querySelector('#Button')
        Button.onclick = async function(){
            if(Email.value == '' && password.value == ''){
                diss[0].style.borderColor = 'red';
                diss[1].style.borderColor = 'red';
                ErroMsg.innerHTML = 'Please fill the inputs';
                return
            }
            if(Email.value == ''){
                diss[0].style.borderColor = 'red';
                ErroMsg.innerHTML = 'Invalid email address';
                Email.focus()
                return
            }
            if(!Email.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
                diss[0].style.borderColor = 'red';
                Email.focus()
                ErroMsg.innerHTML = 'Not a valid email address';
                return
            }
                //  UPDATE COMING, MUST CHECK BASE FOR ACCOUNT EXISTENS
            if(password.value == ''){
                diss[1].style.borderColor = 'red';
                password.focus()
                ErroMsg.innerHTML = 'Must enter password';
                return
            }
            if(password.value.length < 5){
                diss[1].style.borderColor = 'red';
                password.focus()
                ErroMsg.innerHTML = 'Password must be at least 5 characters min';
                return
            }
            if(password.value.length > 11){
                diss[1].style.borderColor = 'red';
                password.focus()
                ErroMsg.innerHTML = 'Maximum password require is 11 characters';
                return
            }

            try{
                const userId = await firebaseService.loginUser(Email.value, password.value);
                console.log("Logged in user ID:", userId);
            
                window.location.href = './UtitbestChatInterface.html';
            }catch(error){
                console.error("Error during login:", error);
                alert("Login failed: " + error.message);
            }
            password.value = '';
            Email.value = '';
            ErroMsg.innerHTML = '';
        }
}

function IfInputIsnull(){
    let tinput = document.querySelectorAll('.fff');
    var diss = document.querySelectorAll('.bbb')
    tinput.forEach((input, i) => {
        input.addEventListener('input', function(){
            diss[i].style.borderColor = 'gray';
        })
    })
}
function Revealer(){
    var sickin = document.querySelector('.sickin')
    var password = document.querySelector('.password')
    sickin.onclick = function(){
        if(password.type == 'password'){
                    password.type = 'text'
                    sickin.innerHTML = '<i class="fa fa-eye vv"></i>';
                }else{
                    password.type = 'password'
                    sickin.innerHTML = '<i class="fa fa-eye-slash vv"></i>';
                }
    }
}
Validation()
IfInputIsnull()
Revealer()  