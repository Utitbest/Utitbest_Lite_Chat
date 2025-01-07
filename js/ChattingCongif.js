import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import FirebaseService from './FireBaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, setDoc, onSnapshot, where, serverTimestamp, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject, getMetadata,} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";




const firebaseConfig = {
    apiKey: "AIzaSyB6tpiYpOYmh9z2LCzWClPhC4IJCWgBaMc",
    authDomain: "utitbest-realchat.firebaseapp.com",
    projectId: "utitbest-realchat",
    storageBucket: "utitbest-realchat.appspot.com",
    messagingSenderId: "904249328831",
    appId: "1:904249328831:web:d60acbc92f7db54f0bb20a"
};





const firebaseService = new FirebaseService(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const auth = firebaseService.auth;
const auth1 = getAuth(firebaseApp)
let currentUserId = null; 
let otherUserId = null

let chatId = null;
var contentdrop = document.querySelectorAll('.comeins i');
var settings = document.querySelectorAll('.listOfcontents')
var droplist = document.querySelector('.dropdown1')
var containerRpy = document.querySelector('.contnet2')
var iconsdem = document.querySelectorAll('.iconsdem span');
var settingsPopup = document.querySelector('.settingsPopup')
var secondusers = document.querySelector('.secondusers')
var sendbutton = document.querySelector('.inputing div button')
var chatInputText = document.querySelector('#messageinput')
var chatlies1 = document.querySelector('.chatlies1')
var Chatterinfordisply = document.querySelector('.chattername h3')
let fon = document.querySelector('.res')
const appender = document.querySelector('.theInputsEtc .inputing')
let ActiveChat = null;
const userprofileId = document.querySelector('.signs');
const fileSelection = document.querySelector('.tochat')






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
        users.forEach((user)  => {
                if (user.id === currentUserId) {
                    return; 
                }

                const userElement = document.createElement("div");
                userElement.className = 'individualchat';
                userElement.setAttribute('data-user-id', user.id)
                userElement.innerHTML = `
                    <div style="display: flex; width: 100%; height: 100%; align-items: center;">
                        <div style="display: flex; align-items: center; justify-content: center; width: 20%; height: 100%; position: relative;" class="allactaive">
                        <span class="" style="position: absolute; top:11px; left:5px; border-radius:50%; width:7px; height:7px;"></span>
                            <figure>
                               <img src="" alt="" class="converse">
                               <utit class="spnman11" style="position :absolute; align-items:center; justify-content:center; height:40px; width:40px; border-radius:50%;  background:#3f6bde;">
                                    <i class="fa fa-spinner fa-spin"style="color:white;"></i>
                                </utit>
                            </figure>
                        </div>
                        <div style="display: flex; align-items: center; width: 80%; height: 100%;">
                            <div class="username_chat">
                                <h3>${user.firstname + ' '+ user.lastname}</h3>
                                <p></p>
                            </div>
                            <div class="times">
                                <p></p>
                                <span>
                                    <span class="whatsappna"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                 setUserProfilePicture(user.id, userElement)

                const repumm = document.querySelector('.currentchatterinfor figure img')
                userElement.addEventListener('click', async() => {
                    if(userprofileId.classList.contains('dwells')){
                        userprofileId.classList.remove('dwells');
                        userprofileId.classList.add('naturea')
                    }
                    otherUserId = user.id;
                    const storageRef = ref(firebaseService.storage, `profilePictures/${otherUserId}.jpg`);
                    const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.jfif`); 
                    let profilePicUrl = null
                    try {
                        profilePicUrl = await getDownloadURL(storageRef);
                        repumm.src = profilePicUrl; // Set user's profile picture
                    } catch (error) {
                        if (error.code === 'storage/object-not-found') {
                        const defaultPicUrl = await getDownloadURL(defaultRef);
                        repumm.src = defaultPicUrl;
                        } else {
                            repumm.src = `./Super icons/defualtman.jfif`
                            console.error('Error fetching profile picture:', error.message);
                        }
                    }
                    chatId = [currentUserId, otherUserId].sort().join('_'); 
                    Chatterinfordisply.innerHTML = user.firstname + user.lastname;
                    initializeChat(chatId); 
                    sendingFilesAsSMS(chatId, currentUserId, otherUserId)
                    
                });
                secondusers.appendChild(userElement);

        });
    } catch (error) {
        console.error("Error loading users:", error);
        firebaseService.showToast(`Error loading users: ${error.message}`, 'error');
    }
} 

async function setUserProfilePicture(userId, userElement) {
    const storageRef = ref(firebaseService.storage, `profilePictures/${userId}.jpg`);
    const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.jfif`);
    const profileImg = userElement.querySelector('.converse');
    const spinner = userElement.querySelector('.spnman11');
    spinner.style.display = 'flex';

    try {
        const profilePicUrl = await getDownloadURL(storageRef);
        profileImg.src = profilePicUrl; 
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
            const defaultPicUrl = await getDownloadURL(defaultRef);

            profileImg.src = defaultPicUrl; 
        } else {
            console.error('Error fetching profile picture:', error.message);
        }
    } finally {
        spinner.style.display = 'none'; 
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
    const userpicture = document.querySelector('.iconsdem figure img')

    let selectedPic = null;
    let profilePicUrl = null;
    ssiiee.style.display = 'none'
    spinners.style.display = 'flex';
    const storageRef = ref(firebaseService.storage, `profilePictures/${userId}.jpg`);
    const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.jfif`);

    try {
        profilePicUrl = await getDownloadURL(storageRef);
        ssiiee.src = profilePicUrl; // Set user's profile picture
        userpicture.src = profilePicUrl
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
        const defaultPicUrl = await getDownloadURL(defaultRef);
        ssiiee.src = defaultPicUrl;
        userpicture.defaultPicUrl
        } else {
            ssiiee.src = `./Super icons/defualtman.jfif`
            userpicture.src = `./Super icons/defualtman.jfif`
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
            userpicture.src = fileURL
            selectedPic = file; 

            // firebaseService.showToast(`Image uploaded successfully`)
            // console.log(selectedPic)

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
                        console.log('Previous profile picture deleted successfully');
                        firebaseService.showToast('Previous profile picture deleted successfully.', 'success');
                    } catch (error) {
                        if (error.code === 'storage/object-not-found') {
                            console.log('No previous image found. Proceeding with upload.');
                        } else {
                            throw error; 
                        }
                    }
                    // const ddde = URL.createObjectURL(File)
                    await uploadBytes(storageRef, selectedPic);
                    const userDocRef = doc(firebaseService.db, 'users', userId);
                    await setDoc(userDocRef, {
                        profilePicture: profilePicUrl,
                        ProfilepictureupdateAt: serverTimestamp()
                    }, { merge: true });

                    firebaseService.showToast('Profile picture uploaded successfully!', 'success');
                    URL.revokeObjectURL(ssiiee.src, userpicture.src)
                    selectedPic = null; 
                } catch (error) {
                    console.error('Error:', error.message);
                    firebaseService.showToast(error.message, 'error');
                    ssiiee.src = defaultRef; 
                    userpicture.src = defaultRef;
                }
            })
        }
    })  
}

async function profileDisplayer() {
    onAuthStateChanged(auth, async (user) =>{
        if(user.uid ){
            const picm = document.querySelector('.iconsdem figure img')
            const storageRef = ref(firebaseService.storage, `profilePictures/${user.uid}.jpg`);
            const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.jfif`);
            const spinner = document.querySelector('.spnman1')
            spinner.style.display = 'flex';
            picm.style.display = 'none';
            try {
                const dowm = await getDownloadURL(storageRef)
                picm.src = dowm;
            } catch (error) {
                  if (error.code === 'storage/object-not-found'){
                    const ty = await getDownloadURL(defaultRef)
                    picm.src = ty
                  }else{
                    picm.src = `./Super icons/defualtman.jfif`;
                    console.error('Error fetching profile picture:', error.message);
                  }
            }finally{
                spinner.style.display = 'none';
                picm.style.display = 'flex';
            }
        }     
    })
}
await profileDisplayer()

async function initializeChat(chatId) {
    try {
        ActiveChat = chatId;
        chatlies1.innerHTML = "";

        firebaseService.listenForMessages(chatId, (messages) => {
            if (chatId !== ActiveChat) return; 
            chatlies1.innerHTML = ""; 

            messages.forEach((message) => {
                const messageElement = document.createElement("div");
                const messageElement1 = document.createElement("div");
                const messageElement2 = document.createElement("div");
                
                const user_response = message.senderId === currentUserId;

                if (user_response) {
                    messageElement.className = 'user_response';
                    messageElement1.className = 'flowsa';
                    messageElement2.className = 'flowsa0';
                } else {
                    messageElement.className = 'replyer';
                    messageElement1.className = 'flowsa';
                    messageElement2.className = 'flowsa1';
                }

                // Handling different message types
                if (typeof message.content === 'string'){
                    messageElement2.innerHTML = `
                        <p>${message.content}</p>
                        <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                    `;
                } else if (message.content?.type === 'image') {
                    messageElement2.innerHTML = `
                        <img src="${message.content.url}" alt="${message.content.name}" style="max-width:300px; border-radius:1em;">
                        <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                    `;
                } else if (message.content?.type === 'video') {
                    messageElement2.innerHTML = `
                        <video src="${message.content.url}" controls style="max-width:300px; border-radius:1em;"></video>
                        <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                    `;
                } else if (message.content?.type === 'audio') {
                    messageElement2.innerHTML = `
                        <audio src="${message.content.url}" style="height:40px; margin-bottom:.5em;" controls></audio>
                        <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                    `;
                } else {
                    messageElement2.innerHTML = `
                        <a href="${message.content.url}" target="_blank">${message.content.name}</a>
                        <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                    `;
                }
                messageElement1.append(messageElement2);
                messageElement.append(messageElement1);
                chatlies1.appendChild(messageElement);
            });

            // Scroll to the latest message
            chatlies1.scrollTop = chatlies1.scrollHeight;
        });
    } catch (error) {
        console.error("Error initializing chat:", error);
    }
}
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
sendbutton.addEventListener("click", async function (){
        const messageContent = chatInputText.value.trim();
        if (messageContent){
            try {
                await firebaseService.sendMessage(
                    chatId,
                    currentUserId, 
                    otherUserId,            
                    messageContent 
                );
                
                chatInputText.value = ""; 
            } catch (error) {
                console.error("Error sending message:", error);
            }
            chatInputText.value = "";
        }
});
window.addEventListener('keyup', (event) =>{
    if(event.keyCode == 13){
        sendbutton.click();
    }
})
async function sendingFilesAsSMS(chatId, senderId, recipientId){
    const vaildfilesize = 10 * 1024 * 1024;
    
    fileSelection.addEventListener('change', function(event){
    document.querySelectorAll('.preview').forEach(preview => preview.remove());
    chatInputText.value = '';
    chatInputText.setAttribute('disabled', '')
    chatInputText.style.cursor = 'not-allowed'

    let selecion = event.target.files[0];
    const fileType = selecion.type.split('/')[0];
    let PreviewAll = document.createElement('div')
        PreviewAll.className = 'preview';
    
    let exitIt = document.createElement('span')
        exitIt.className = 'exiting'
        exitIt.innerHTML = `
            <i class="fa fa-xmark"></i>
        `
        exitIt.addEventListener('click', ()=>{
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            fileSelection.value = '';
            chatInputText.style.cursor = ''
            chatInputText.removeAttribute('disabled')
            sendbutton.removeAttribute('disabled')
            sendbutton.innerHTML = `
                <i class="fa fa-paper-plane res"></i>
            `
            selecion = null
        })
    let tweek = document.createElement('div')
        tweek.className = 'tweek';
    let animationprogress = document.createElement('div')
        animationprogress.className = 'animationprogress'
    let newsendbuds = document.createElement('button')
        newsendbuds.className = 'newsendbuds';
        newsendbuds.innerHTML = 'Send';


    if(!selecion){
        firebaseService.showToast('Please select file.', 'error')
        selecion = null
        fileSelection.value = ''
        document.querySelectorAll('.preview').forEach(preview => preview.remove());
        chatInputText.style.cursor = ''
        chatInputText.removeAttribute('disabled')
        sendbutton.removeAttribute('disabled')
        sendbutton.innerHTML = `
            <i class="fa fa-paper-plane res"></i>
        `
        return
    }
    if(selecion.size > vaildfilesize){
        firebaseService.showToast('File size is greater than 10mb', 'error')
        selecion = null
        fileSelection.value = ''
        document.querySelectorAll('.preview').forEach(preview => preview.remove());
        chatInputText.style.cursor = ''
        chatInputText.removeAttribute('disabled')
        sendbutton.removeAttribute('disabled')
        sendbutton.innerHTML = `
            <i class="fa fa-paper-plane res"></i>
        `
        return
    }
    
    if(fileType === 'image'){
        const reader = new FileReader()
            reader.onload = function(e){
                
                tweek.innerHTML = `
                    <img src="${e.target.result}" alt="Image preview" style="width:300px; heigth:90%">
                    <p class="somep">${selecion.name}</p>
                `
            }
            reader.readAsDataURL(selecion)
    }else if(fileType === 'audio'){
        const reader = new FileReader()
            reader.onload = function(e){
                tweek.innerHTML = `
                    <audio src="${e.target.result}" flie.type="${selecion.type}" controls></audio>
                    <p class="somep">${selecion.name}</p>
                `
            }
            reader.readAsDataURL(selecion)
    }else if(fileType === 'video'){
        const reader = new FileReader()
            reader.onload = function(e){
                tweek.innerHTML = `
                    <video src="${e.target.result}" flie.type="${selecion.type}" style="width:300px" heigth:90%; controls></video>
                    <p class="somep">${selecion.name}</p>
                `
            }
            reader.readAsDataURL(selecion)
    }else{
        tweek.innerHTML = `
            <img src="./Super icons/Empty tag.png" alt="" style="width:100%; height:90%;">
            <p class="somep">${selecion.name}</p>
        `
    }

    PreviewAll.append(exitIt, tweek, newsendbuds)
    appender.append(PreviewAll);
    sendbutton.setAttribute('disabled', '')
    sendbutton.innerHTML = `
        <i class="fa fa-ban"></i>
    `
    
    newsendbuds.addEventListener('click', async () => {
        if (!selecion) {
            firebaseService.showToast('Please select file.', 'error');
            selecion = null;
            fileSelection.value = '';
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            chatInputText.style.cursor = '';
            chatInputText.removeAttribute('disabled');
            sendbutton.removeAttribute('disabled');
            sendbutton.innerHTML = `
                <i class="fa fa-paper-plane res"></i>
            `;
            return;
        }
    
        if (selecion.size > vaildfilesize) {
            firebaseService.showToast('File size is greater than 10mb', 'error');
            selecion = null;
            fileSelection.value = '';
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            chatInputText.style.cursor = '';
            chatInputText.removeAttribute('disabled');
            sendbutton.removeAttribute('disabled');
            sendbutton.innerHTML = `
                <i class="fa fa-paper-plane res"></i>
            `;
            return;
        }
    
        try {
            const storageRef = ref(firebaseService.storage, `chatFiles/${chatId}/${Date.now()}_${selecion.name}`);
            const uploadTask = uploadBytesResumable(storageRef, selecion);
            uploadTask.on('state_changed', (snapshot) => {
                tweek.innerHTML = '';
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                animationprogress.style.width = progress + '%';
                const Roundup = Math.floor(progress)
                animationprogress.innerHTML = 'Uploading file please wait..'+ ' ' + Roundup + '%';
                tweek.append(animationprogress);
            }, async (error) => {
                firebaseService.showToast(`Upload failed: ${error.message}`, 'error');
                
                try {
                    await deleteObject(uploadTask.snapshot.ref); 
                    console.log("File successfully deleted due to error.");
                } catch (deleteError) {
                    console.error("Error deleting file: ", deleteError.message);
                }
    
                // Cleanup and reset UI
                selecion = null;
                fileSelection.value = '';
                document.querySelectorAll('.preview').forEach(preview => preview.remove());
                chatInputText.style.cursor = '';
                chatInputText.removeAttribute('disabled');
                sendbutton.removeAttribute('disabled');
                sendbutton.innerHTML = `
                    <i class="fa fa-paper-plane res"></i>
                `;
            }, async () => {
                const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
                const messageContent = {
                    type: fileType,
                    name: selecion.name,
                    url: fileURL,
                    size: selecion.size,
                };
    
                await firebaseService.sendMessage(chatId, senderId, recipientId, messageContent);
    
                firebaseService.showToast('File sent successfully!', 'success');
                selecion = null;
                document.querySelectorAll('.preview').forEach(preview => preview.remove());
                fileSelection.value = '';
                chatInputText.style.cursor = '';
                chatInputText.removeAttribute('disabled');
                sendbutton.removeAttribute('disabled');
                sendbutton.innerHTML = `
                    <i class="fa fa-paper-plane res"></i>
                `;
            });
    
        } catch (error) {
            firebaseService.showToast(`Error while sending file: ${error.message}`, 'error');
            
            // Ensure deletion if any error occurs
            try {
                const storageRef = ref(firebaseService.storage, `chatFiles/${chatId}/${Date.now()}_${selecion.name}`);
                await deleteObject(storageRef); // Use the correct reference for deletion
                console.log("File successfully deleted due to error.");
            } catch (deleteError) {
                console.error("Error deleting file: ", deleteError.message);
            }
    
            selecion = null;
            fileSelection.value = '';
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            chatInputText.style.cursor = '';
            chatInputText.removeAttribute('disabled');
            sendbutton.removeAttribute('disabled');
            sendbutton.innerHTML = `
                <i class="fa fa-paper-plane res"></i>
            `;
        }
    });
    
   

    })

}


// To be continue////////////////////////////////////////////







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
    //   alert('Failed to log out. Please try again.');
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