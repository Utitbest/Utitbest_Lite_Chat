import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import FirebaseService from './FireBaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, setDoc, onSnapshot, where, serverTimestamp, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, getMetadata,} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";




const firebaseConfig = {
    apiKey: "AIzaSyB6tpiYpOYmh9z2LCzWClPhC4IJCWgBaMc",
    authDomain: "utitbest-realchat.firebaseapp.com",
    projectId: "utitbest-realchat",
    storageBucket: "utitbest-realchat.appspot.com",
    messagingSenderId: "904249328831",
    appId: "1:904249328831:web:d60acbc92f7db54f0bb20a"
};





const firebaseService = new FirebaseService(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig); // Initialize Firebase
// const storage = getStorage(firebaseApp)
const auth = firebaseService.auth;
// let currentUserId;   // Stores the logged-in user's ID
let currentUserId = null//= firebaseService.auth.currentUser?.uid; // Make sure user is logged in
let otherUserId = null

let chatId = null;
// console.log(chatId)
var contentdrop = document.querySelectorAll('.comeins i');
var settings = document.querySelectorAll('.listOfcontents')
var droplist = document.querySelector('.dropdown1')
var containerRpy = document.querySelector('.contnet2')
var iconsdem = document.querySelectorAll('.iconsdem span');
var settingsPopup = document.querySelector('.settingsPopup')
var secondusers = document.querySelector('.secondusers')
var sendbutton = document.querySelector('.inputing div span')
var chatInputText = document.querySelector('.inputing div input')
var chatlies1 = document.querySelector('.chatlies1')
var Chatterinfordisply = document.querySelector('.chattername h3')
let ActiveChat = null;
const AudioChat = document.querySelectorAll('.dropdown2 li')
    AudioChat[0].addEventListener('click', function(){
        alert('hllo ')
    })
const maximum = 7;





function Settings(){
    settings[1].addEventListener('click', function(){
        containerRpy.innerHTML = `
            <div class="Chat">
                <h2>Chats</h2>
                <button>Clear all messages</button>
                <p>Delete all messages from chats</p>
            </div>
        `;
    })
    
    settings[2].addEventListener('click', function(){
        containerRpy.innerHTML = `
            <div class="vid_voce">
                <h2>Voice</h2>
                <h5>Microphone</h5>
                <div class="testingmicro">
                    <i class="fa fa-microphone"></i>
                    <h5>Device microphone</h5>
                </div>
                <div class="testingmicro1">
                    <h5>Speak into your device mic</h5>
                    <div class="">
                            <i class="fa fa-microphone"></i>
                            <progress max="100" min="0" value=""></progress>
                    </div>
                </div>
                <div class="speakers">
                    <h5>Speakers</h5>
                    <div class="Xbass">
                        <i class="fa fa-volume-up"></i>
                        <h5 style="padding-left:0;">Device speakers</h5>
                    </div>
                    <button class="">Click to test speak..</button>
                </div>
            </div>
        `;
    })
    settings[3].addEventListener('click',function(){
        containerRpy.innerHTML = `
            <div class="Customize">
                <p class="fa-shake">&#128540;</p>
                <h2 class="fa-bounce">COMING SOON!!</h2>
            </div>
        `;
    })
}
Settings()
onAuthStateChanged(auth, (user) => {
    if (user) {
      firebaseService.listenForMessages11();
    } else {
      console.error("No user is logged in. Redirecting to login...");
      window.location.href = './indexLogin.html';
    }
  });

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                currentUserId = user.uid;

                const userData = await firebaseService.getUserData(currentUserId);
                settings[0].addEventListener('click', function(){
                    containerRpy.innerHTML =  `
                        <div class="Profile_i">
                        <h2>Profile</h2>
                        <div style="display:flex; width: 90%; align-items:end;">
                            <label for="eel" style="margin-left: .5em; position: relative;">
                                <img src="" alt="">
                                <i class="fa fa-edit rr"></i>
                                <span class="spnman" style="position:absolute; top:36%; left:35%; align-items:center; justify-content:center; height:30px; width:30px; border-radius:50%;  background:#3f6bde;">
                                    <i class="fa fa-spinner fa-spin"style="color:white;"></i>
                                </span>
                            </label>
                            <button class="uploadalbum" style=" cursor:pointer; font-weight:600; display:flex; padding:.6em; height:15px; border:none; background:#3f6bde; color:white; border-radius:7px; align-items:center; justify-content:center;">Save</button>
                           <input type="file" accept="image/*" id="eel" class="nothings">
                        </div>  
                           <div class="namecoms">
                                <div class="informs" title="Firstname">
                                    <p>${userData.firstname}</p>
                                    <span class="EditName">
                                        <i class="fa fa-edit"></i>
                                    </span>
                                </div>
                                <div style="margin-top:.6em;" class="informs" title="Lastname">
                                    <p>${userData.lastname}</p>
                                    <span class="EditName">
                                        <i class="fa fa-edit"></i>
                                    </span>
                                </div>
                                <div style="margin-top:.6em;" class="informs" title="Email">
                                    <p>${userData.email}</p>
                                    <span class="EditName">
                                        <i class="fa fa-edit"></i>
                                    </span>
                                </div>
                                <button style="margin-top:5em;" type="button">Log out</button>
                           </div>
                        </div>
                    `;
                    Tologout()
                    updateprofilepic()
                })

            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        } else {
            window.location.href = './indexLogin.html';
        }
    });
});
async function loadAllUsers() {
    try{
        const users = await firebaseService.getAllUsers();
        if(users.length === 0){
            secondusers.innerHTML = 'No other users found.';
            return
        }
        users.forEach((user) => {
            if(user.id !== currentUserId){  
                const userElement = document.createElement("div");
                userElement.className = 'individualchat';
                userElement.setAttribute('data-user-id', user.id)
                userElement.innerHTML = `
                    <div style="display: flex; width: 100%; height: 100%; align-items: center;">
                        <div style="display: flex; align-items: center; justify-content: center; width: 20%; height: 100%; position: relative;" class="allactaive">
                        <span class="" style="position: absolute; top:11px; left:5px; border-radius:50%; width:7px; height:7px;"></span>
                            <figure>
                                <img src="./Super icons/manssincon.png" alt="">
                            </figure>
                        </div>
                        <div style="display: flex; align-items: center; width: 80%; height: 100%;">
                            <div class="username_chat">
                                <h3>${user.firstname + ' '+ user.lastname}</h3>
                                <p>Last message preview</p>
                            </div>
                            <div class="times">
                                <p>20:30</p>
                                <span>
                                    <span></span>
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                
                // Set otherUserId and chatId when a user is clicked
                userElement.addEventListener('click', async() => {
                    otherUserId = user.id;
                    chatId = [currentUserId, otherUserId].sort().join('_'); 
                    Chatterinfordisply.innerHTML = user.firstname + user.lastname;
                    
                    initializeChat(chatId); 
                    
                });
                secondusers.appendChild(userElement);
                
            }

        });
    } catch (error) {
        console.error("Error loading users:", error);
    }
} 
async function updateprofilepic(){
    onAuthStateChanged(auth, async (user) =>{
    if(user){
    const userId = user.uid 
    const ssiiee = document.querySelector('.Profile_i label img')
    const inputtag = document.querySelector('.nothings')
    const Savebutton = document.querySelector('.uploadalbum')
    const spinners = document.querySelector('.spnman');
    let selectedPic = null;
    ssiiee.style.display = 'none'
    spinners.style.display = 'flex';
    const storageRef = ref(firebaseService.storage, `profilePictures/${userId}.jpg`);
    const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.jfif`);

    try {
        const profilePicUrl = await getDownloadURL(storageRef);
        ssiiee.src = profilePicUrl; // Set user's profile picture
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
        const defaultPicUrl = await getDownloadURL(defaultRef);
        ssiiee.src = defaultPicUrl;
        } else {
            ssiiee.src = `./Super icons/defualtman.jfif`
            console.error('Error fetching profile picture:', error.message);
        }
    }finally{
        spinners.style.display = 'none'
        ssiiee.style.display = 'flex';
    }


    inputtag.addEventListener('change',  (event) =>{
            const file = event.target.files[0];
            if(!file){
                firebaseService.showToast('Please select a file to upload.', 'error')
                // ssiiee.src = profilePicUrl
                selectedPic = null;
                return
            }
            const vaildfilesize = 10 * 1024 * 1024;

            if(file.size > vaildfilesize){
                firebaseService.showToast('File size is greater than 10mb.', 'error')
                selectedPic = null
                return;
            }
            

            const fileURL = URL.createObjectURL(file);
            ssiiee.src = fileURL;
            selectedPic = file;   
            firebaseService.showToast(`Image uploaded successfully`)
            console.log(selectedPic)

        })

        
            Savebutton.addEventListener('click', async ()=>{
                if (!selectedPic) {
                    firebaseService.showToast('No file selected for upload.', 'error');
                    return;
                }

                try {
    
                      try {
                        const metadata = await getMetadata(storageRef);
                        console.log('Image exists:', metadata);
    
                        await deleteObject(storageRef);
                        console.log('Previous image deleted successfully');
                        firebaseService.showToast('Previous profile picture deleted successfully.', 'success');
                    } catch (error) {
                        if (error.code === 'storage/object-not-found') {
                            console.log('No previous image found. Proceeding with upload.');
                        } else {
                            throw error; 
                        }
                    }
    
                    await uploadBytes(storageRef, selectedPic);
                    firebaseService.showToast('Profile picture uploaded successfully!', 'success');
                    URL.revokeObjectURL(ssiiee.src)
                    selectedPic = null; 
                } catch (error) {
                    console.error('Error:', error.message);
                    firebaseService.showToast(error.message, 'error');
                    ssiiee.src = ''; 
                }
            })
        }
    })  
}
async function uploadalbumpenter() {
    onAuthStateChanged(auth, async (user) =>{
        if(user){
            const userNo = user.uid;
            const storageRef = ref(firebaseService.storage, `profilePictures/${userNo}.jpg`);
            const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.jfif`);
            const spins = document.querySelector('.spnman1')
            const userpicture = document.querySelector('.iconsdem figure img')
            spins.style.display = 'flex';
            userpicture.style.display = 'none';
            try {
                const download = await getDownloadURL(storageRef);
                userpicture.src = download
            } catch (error) {
                if (error.code === 'storage/object-not-found') {
                    const defaultPicUrl = await getDownloadURL(defaultRef);
                    userpicture.src = defaultPicUrl;
                    } else {
                        userpicture.src = `./Super icons/defualtman.jfif`
                        console.error('Error fetching profile picture:', error.message);
                    }
                // firebaseService.showToast(`Error while retrieving user profile${error}`)   
            }finally{
                spins.style.display = 'none';
                userpicture.style.display = 'flex';
            }
           
        }
    })
}
uploadalbumpenter()

                  

function getRelativeTime(timestamp) {
    const currentTime = new Date();
    const messageTime = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const timeDiff = currentTime - messageTime; // Difference in milliseconds

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) {
        return days === 1 ? 'Yesterday' : `${days} days ago`;
    }
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `Just now`; 
}

async function initializeChat(chatId) {
    try {
        ActiveChat = chatId;
        chatlies1.innerHTML = "";

        firebaseService.listenForMessages(chatId, (messages) => {
            if(chatId !== ActiveChat) return;
            chatlies1.innerHTML = ""; 

            messages.forEach((message) => {
                const messageElement = document.createElement("div");
                const user_reponse = message.senderId === currentUserId;
                if(user_reponse){
                    messageElement.className = 'user_response';
                    messageElement.innerHTML = `
                    <div class="user_response1">
                        <div>
                            <p>${message.content}</p>
                            <span class="finn">
                                <i class="fa fa-check-double"></i>
                                <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                            </span>
                        </div>
                    </div>
                    `;
                }else{
                    messageElement.className = 'replyer';
                    messageElement.innerHTML = `
                    <div class="replyer1">
                        <figure>
                            <img src="./Super icons/f4c1820a-74a2-4fb3-ab1f-bfc13b1db462.jfif" alt="">
                        </figure>
                        <span>
                            <p>${message.content}</p>
                            <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                        </span>
                    </div>
                    `;
                }
                chatlies1.appendChild(messageElement);
            });

            // Scroll to the latest message
            chatlies1.scrollTop = chatlies1.scrollHeight;
        });
    } catch (error) {
        console.error("Error initializing chat:", error);
    }
}

sendbutton.addEventListener("click", async function () {
        const messageContent = chatInputText.value.trim();
        if (messageContent){
            try {
                await firebaseService.sendMessage(
                    chatId, // Current chatId
                    currentUserId, // Sender (logged-in user)
                    otherUserId, // Recipient                    
                    messageContent // Message content
                );
                
                chatInputText.value = ""; 
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
});


// To be continue////////////////////////////////////////////

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;

        // Add online/offline listeners
        window.addEventListener("online", () => {
            console.log("Online event triggered");
            updateUserStatus(userId, true);
        });

        window.addEventListener("offline", () => {
            console.log("Offline event triggered");
            updateUserStatus(userId, false);
        });

        // Start listening for real-time user status updates
        listenForUserStatusUpdates();
    }
});

async function updateUserStatus(userId, isActive) {
    const userRef = doc(firebaseService.db, "users", userId);
    try {
        console.log(`Updating status for ${userId}: ${isActive}`);
        await updateDoc(userRef, {
            isActive: isActive,
            lastActive: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating user status:", error);
    }
}

async function listenForUserStatusUpdates() {
    const usersRef = collection(firebaseService.db, "users");
    onSnapshot(usersRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const userId = change.doc.id;
            const userData = change.doc.data();

            // console.log(`Snapshot change: ${change.type} for ${userId}`, userData);

            if (change.type === "modified" && userData.isActive !== undefined) {
                updateUserUI(userId, userData.isActive);
            }
        });
    });
}

function updateUserUI(userId, isActive) {
    const userElement = document.querySelector(`.individualchat[data-user-id="${userId}"]`);
    if (!userElement) return;
    const statusElement = userElement.querySelector(".allactaive span");
    if (statusElement) {
        statusElement.className = isActive ? "online" : "offline";
        console.log(`Updated UI for ${userId} to ${isActive ? "online" : "offline"}`);
    }
}

////////////////////////////////////////////////////


















function HideSettings(){
    iconsdem[2].addEventListener('click', function(){
        if(settingsPopup.classList.contains('steeze')){
            settingsPopup.classList.add('steeze1')
            settingsPopup.classList.remove('steeze')
        }
    })
}

async function logoutUser() {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.href = './indexLogin.html';
    }catch(error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
}
  
function Tologout(){
    let logoutbud = document.querySelector('.namecoms button')
    logoutbud.onclick = () => {
        logoutUser()
    }
}

function ContentDrop(){
    contentdrop[1].addEventListener('click', function(){
        if(droplist.classList.contains('insidehide')){
            droplist.classList.remove('insidehide')
            droplist.classList.add('outsideshow')
        }else{
            droplist.classList.remove('outsideshow')
            droplist.classList.add('insidehide')
        }
    })
}

window.onclick = function(event){
    if(!event.target.matches('.comeins i') && !event.target.matches('.dropdown1')){
        droplist.classList.remove('outsideshow')
        droplist.classList.add('insidehide')
    }
}

document.addEventListener('click', function(event){
    if( iconsdem[2].contains(event.target)){
        settingsPopup.classList.add('steeze1')
        settingsPopup.classList.remove('steeze')
    }else if(!settingsPopup.contains(event.target)){
        settingsPopup.classList.remove('steeze1')
        settingsPopup.classList.add('steeze')
    }
})

window.addEventListener('online', FreashIn)
window.addEventListener('offline', FreashOff)
function FreashIn(){
    let totori = document.createElement('div')
        totori.className = 'updater';
        let pink = document.createElement('p')
            pink.innerHTML = 'You\'re Back Online';
            totori.append(pink)


        document.body.append(totori)

        setTimeout(() =>{
            totori.remove()
        }, 6000)
}
function FreashOff(){
    let totori = document.createElement('div');
        totori.className = 'updater';
        let pink = document.createElement('p')
            pink.innerHTML = 'Your Internet connection is down';
            totori.append(pink)
        document.body.append(totori)
        setTimeout(() =>{
            totori.remove()
        }, 9000)
}


ContentDrop()
HideSettings()
document.addEventListener("DOMContentLoaded", loadAllUsers())