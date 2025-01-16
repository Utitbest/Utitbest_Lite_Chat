import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6tpiYpOYmh9z2LCzWClPhC4IJCWgBaMc",
    authDomain: "utitbest-realchat.firebaseapp.com",
    projectId: "utitbest-realchat",
    storageBucket: "utitbest-realchat.appspot.com",
    messagingSenderId: "904249328831",
    appId: "1:904249328831:web:d60acbc92f7db54f0bb20a"
};

function showToast(message, type = "success"){
    Toastify({
      text: message,
      duration: 4000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
  }

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
var Button = document.querySelector('button')
const popss = document.getElementsByClassName('foree')[0]
async function sendPasswordReset(email){
    try {
      
        if (!email || typeof email !== 'string') {
            showToast(`Invalid email address.`, 'error')
            return
        }
        await sendPasswordResetEmail(auth, email);
        popin()
        showToast(`Password reset link sent to ${email}`)
    } catch (error) {
        showToast(`Error: ${error}`, 'error')
    }
}

function popin(){
    popss.style.display = 'flex'
    setTimeout(() => {
        popss.style.display = 'none';
    }, 5000);
}


Button.addEventListener('click', async () => {
    let Email = document.querySelector('.joy_is_coming').value.trim();
    await sendPasswordReset(Email);
});


function Revealer(){
var Email = document.querySelector('#ww')
var entt = document.querySelector('.vibes1')
    Email.addEventListener('input', function(){
        entt.style.borderColor = 'gray';
    })
}

Revealer()